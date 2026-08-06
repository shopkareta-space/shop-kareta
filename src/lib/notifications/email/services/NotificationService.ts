import { createClient } from "@/lib/supabase/server";
import React from "react";

import { EmailProvider } from "../providers/EmailProvider.interface";
import { ResendProvider } from "../providers/ResendProvider";
import { SmtpProvider } from "../providers/SmtpProvider";
import { MockProvider } from "../providers/MockProvider";
import { NotificationConfig, EmailPayload } from "../types";

// Import Templates
import { OrderConfirmationEmail } from "../templates/OrderConfirmationEmail";
import { OrderStatusEmail } from "../templates/OrderStatusEmail";
import { AdminNotificationEmail } from "../templates/AdminNotificationEmail";

const MAX_RETRIES = 3;

/**
 * NotificationService
 * 
 * The single entry point for sending notifications across the application.
 * Abstracts away the provider (Resend, SMTP, etc.) and the template logic.
 */
class NotificationService {
  private getProviderConfig(): NotificationConfig {
    // According to the requirement, provider selection should be entirely env-based.
    // If we wanted to allow admin override via DB, we could fetch it here (but since 
    // it says "Changing provider should require ONLY updating environment variables", 
    // we strictly use process.env).
    return {
      provider: process.env.EMAIL_PROVIDER || 'resend',
      senderName: process.env.EMAIL_SENDER_NAME || 'Shop Kareta',
      senderEmail: process.env.EMAIL_SENDER_ADDRESS || 'orders@shopkareta.com',
      replyTo: process.env.EMAIL_REPLY_TO || 'support@shopkareta.com'
    };
  }

  private getProviderInstance(config: NotificationConfig): EmailProvider {
    switch (config.provider.toLowerCase()) {
      case 'resend':
        return new ResendProvider(process.env.RESEND_API_KEY || '');
      case 'smtp':
        return new SmtpProvider();
      case 'mock':
      default:
        return new MockProvider();
    }
  }

  // ==========================================
  // SEMANTIC API METHODS
  // ==========================================

  public async sendOrderConfirmation(
    to: string, 
    customerName: string, 
    orderId: string, 
    deliveryId: string, 
    totalAmount: number, 
    shippingAddress: any, 
    items: any[],
    orderDate: string,
    paymentMethod: string,
    paymentStatus: string,
    estimatedDelivery: string,
    subtotal: number,
    shippingCost: number,
    discountAmount: number
  ) {
    const payload: EmailPayload = {
      to,
      subject: `🎉 Your Shop Kareta Order is Confirmed! (#${deliveryId})`,
      templateName: "OrderConfirmation",
      react: React.createElement(OrderConfirmationEmail, {
        customerName,
        orderId,
        deliveryId,
        totalAmount,
        shippingAddress,
        items,
        orderDate,
        paymentMethod,
        paymentStatus,
        estimatedDelivery,
        subtotal,
        shippingCost,
        discountAmount
      })
    };
    
    // We queue the email, and it does not block the main execution flow.
    await this.queueEmail(payload);
  }

  public async sendOrderStatus(
    to: string,
    customerName: string,
    orderId: string,
    status: string,
    trackingNumber?: string,
    courier?: string,
    trackingUrl?: string
  ) {
    const payload: EmailPayload = {
      to,
      subject: `Order Update: #${orderId.substring(0, 8).toUpperCase()}`,
      templateName: `OrderStatus_${status}`,
      react: React.createElement(OrderStatusEmail, {
        customerName,
        orderId,
        status,
        trackingNumber,
        courier,
        trackingUrl
      })
    };

    await this.queueEmail(payload);
  }

  public async sendAdminAlert(
    title: string,
    message: string,
    details?: Record<string, string>,
    actionUrl?: string,
    actionText?: string
  ) {
    const to = process.env.ADMIN_EMAIL || 'admin@shopkareta.com';
    const payload: EmailPayload = {
      to,
      subject: `Admin Alert: ${title}`,
      templateName: "AdminAlert",
      react: React.createElement(AdminNotificationEmail, { 
        title, 
        message, 
        details, 
        actionUrl, 
        actionText 
      })
    };

    await this.queueEmail(payload);
  }

  public async sendTestEmail(to: string) {
    const payload: EmailPayload = {
      to,
      subject: "Test Email from Shop Kareta Notification System",
      templateName: "TestEmail",
      react: React.createElement(AdminNotificationEmail, { 
        title: "Test Email Successful", 
        message: "Your new Provider-Agnostic Notification Architecture is working perfectly!" 
      })
    };

    await this.queueEmail(payload);
  }

  // ==========================================
  // QUEUE & RETRY LOGIC
  // ==========================================

  /**
   * queues an email by saving to the DB and dispatching the worker asynchronously.
   * In a future update (e.g. BullMQ, Inngest), this is where you'd enqueue the job.
   */
  private async queueEmail(payload: EmailPayload) {
    const supabase = await createClient();

    // 1. Create a pending log entry
    const { data: logEntry, error: logError } = await supabase
      .from("email_logs")
      .insert({
        recipient: Array.isArray(payload.to) ? payload.to.join(", ") : payload.to,
        template_name: payload.templateName,
        subject: payload.subject,
        status: "pending",
      })
      .select("id")
      .single();

    if (logError || !logEntry) {
      console.error("[NotificationService] Failed to create email log entry:", logError);
      // We proceed to send even if logging fails, to ensure delivery.
    }

    const logId = logEntry?.id;

    // 2. Fire and forget the background processor
    // Do NOT await this, so it runs asynchronously without blocking the request (e.g. checkout API)
    this.processEmailBackground(logId, payload);
  }

  /**
   * Background worker to process the email.
   */
  private async processEmailBackground(logId: string | undefined, payload: EmailPayload, retryCount = 0) {
    const supabase = await createClient();
    
    try {
      const config = this.getProviderConfig();
      const provider = this.getProviderInstance(config);

      const senderInfo = {
        from: `${config.senderName} <${config.senderEmail}>`,
        replyTo: config.replyTo
      };

      // Send Email
      const result = await provider.sendEmail(payload, senderInfo);

      // Update Log on success
      if (logId) {
        if (result.success) {
          await supabase
            .from("email_logs")
            .update({
              status: "sent",
              sent_time: new Date().toISOString(),
            })
            .eq("id", logId);
        } else {
          throw new Error(result.error || "Unknown provider error");
        }
      }
    } catch (error: any) {
      console.error(`[NotificationService] Failed to send email (Retry ${retryCount}):`, error);
      
      if (logId) {
        await supabase
          .from("email_logs")
          .update({
            status: "failed",
            failed_time: new Date().toISOString(),
            error_message: error.message,
            retry_count: retryCount + 1,
          })
          .eq("id", logId);
          
        // Handle Retry Logic (Exponential backoff)
        if (retryCount < MAX_RETRIES) {
          const delay = Math.pow(3, retryCount) * 5000;
          setTimeout(() => {
            this.processEmailBackground(logId, payload, retryCount + 1);
          }, delay);
        }
      }
    }
  }
}

// Export a singleton instance
export const notificationService = new NotificationService();
