import { EmailProvider } from "./EmailProvider.interface";
import { EmailPayload, ProviderResponse } from "../types";

export class MockProvider implements EmailProvider {
  async sendEmail(payload: EmailPayload, senderInfo: { from: string; replyTo?: string }): Promise<ProviderResponse> {
    console.log("\n==========================================");
    console.log(`[MockProvider] MOCK EMAIL SEND EVENT`);
    console.log(`==========================================`);
    console.log(`To: ${Array.isArray(payload.to) ? payload.to.join(', ') : payload.to}`);
    console.log(`From: ${senderInfo.from}`);
    console.log(`Subject: ${payload.subject}`);
    console.log(`Template: ${payload.templateName || 'None'}`);
    console.log(`==========================================\n`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, messageId: `mock-${Date.now()}` };
  }

  async healthCheck(): Promise<{ ok: boolean; message?: string }> {
    return { ok: true, message: "Mock provider is always healthy" };
  }
}
