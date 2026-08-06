import { EmailProvider } from "./EmailProvider.interface";
import { EmailPayload, ProviderResponse } from "../types";

export class SmtpProvider implements EmailProvider {
  constructor() {
    // In a real implementation, you would initialize nodemailer here
    // using process.env.SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
  }

  async sendEmail(payload: EmailPayload, senderInfo: { from: string; replyTo?: string }): Promise<ProviderResponse> {
    // This is a stub for future SMTP integration using nodemailer or similar
    console.warn("[SmtpProvider] SMTP provider is not fully implemented yet. Simulating success.");
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, messageId: `smtp-${Date.now()}` };
  }

  async healthCheck(): Promise<{ ok: boolean; message?: string }> {
    if (!process.env.SMTP_HOST) {
      return { ok: false, message: "Missing SMTP configuration" };
    }
    return { ok: true, message: "SMTP configuration is present (connection not verified in stub)" };
  }
}
