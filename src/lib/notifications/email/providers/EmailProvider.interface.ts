import { EmailPayload, ProviderResponse } from "../types";

export interface EmailProvider {
  /**
   * The core method to send an email.
   * Providers will handle translating the payload (which may contain a React element)
   * into their specific API payload requirements.
   */
  sendEmail(payload: EmailPayload, senderInfo: { from: string; replyTo?: string }): Promise<ProviderResponse>;

  /**
   * Optional health check method to verify configuration (e.g. API keys, SMTP connection).
   */
  healthCheck(): Promise<{ ok: boolean; message?: string }>;
}
