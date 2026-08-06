import React from "react";

export interface EmailPayload {
  to: string | string[];
  subject: string;
  react?: React.ReactElement; // HTML generated from React templates
  html?: string;              // Raw HTML fallback
  text?: string;              // Plain text fallback
  templateName?: string;      // Used for logging
}

export interface NotificationConfig {
  provider: string;           // "resend", "smtp", "mock", etc.
  senderName: string;
  senderEmail: string;
  replyTo?: string;
}

export interface ProviderResponse {
  success: boolean;
  error?: string;
  messageId?: string;
}
