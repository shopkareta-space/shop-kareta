import { Resend } from "resend";
import { EmailProvider } from "./EmailProvider.interface";
import { EmailPayload, ProviderResponse } from "../types";

export class ResendProvider implements EmailProvider {
  private resend: Resend;

  constructor(apiKey: string) {
    if (!apiKey) {
      console.warn("[ResendProvider] Initialized without an API key.");
    }
    this.resend = new Resend(apiKey);
  }

  async sendEmail(payload: EmailPayload, senderInfo: { from: string; replyTo?: string }): Promise<ProviderResponse> {
    try {
      // Resend specifically supports the `react` field which takes a ReactElement.
      // If `react` is not provided, we fallback to html or text.
      const sendPayload: any = {
        from: senderInfo.from,
        to: Array.isArray(payload.to) ? payload.to : [payload.to],
        subject: payload.subject,
        replyTo: senderInfo.replyTo,
      };

      if (payload.react) {
        sendPayload.react = payload.react;
      } else if (payload.html) {
        sendPayload.html = payload.html;
      } else if (payload.text) {
        sendPayload.text = payload.text;
      } else {
        throw new Error("Missing content for email (react, html, or text must be provided).");
      }

      const { data, error } = await this.resend.emails.send(sendPayload);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, messageId: data?.id };
    } catch (err: any) {
      return { success: false, error: err.message || "Unknown Resend error" };
    }
  }

  async healthCheck(): Promise<{ ok: boolean; message?: string }> {
    if (!process.env.RESEND_API_KEY) {
      return { ok: false, message: "Missing RESEND_API_KEY environment variable" };
    }
    // Simplistic check since Resend doesn't have a dedicated ping endpoint
    return { ok: true, message: "Resend configuration is present" };
  }
}
