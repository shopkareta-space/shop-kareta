import {
  Heading,
  Text,
  Button,
  Section,
  Hr,
} from "@react-email/components";
import * as React from "react";
import { EmailLayout, h1, text, button } from "./EmailLayout";

interface PasswordResetEmailProps {
  customerName?: string;
  resetUrl: string;
  expiresInMinutes?: number;
}

export const PasswordResetEmail = ({
  customerName = "there",
  resetUrl,
  expiresInMinutes = 60,
}: PasswordResetEmailProps) => {
  return (
    <EmailLayout previewText="Reset your Shop Kareta password">
      <Heading style={h1}>Reset Your Password</Heading>

      <Text style={text}>Hi {customerName},</Text>
      <Text style={text}>
        We received a request to reset the password for your Shop Kareta account.
        Click the button below to set a new password. This link expires in{" "}
        <strong>{expiresInMinutes} minutes</strong>.
      </Text>

      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <Button href={resetUrl} style={resetButton}>
          Reset My Password
        </Button>
      </Section>

      <Hr style={{ borderColor: "#e2e8f0", margin: "24px 0" }} />

      <Text style={{ ...text, fontSize: "14px", color: "#94a3b8" }}>
        If you did not request a password reset, please ignore this email. Your
        password will not be changed. For security questions, contact us at{" "}
        shopkareta@gmail.com.
      </Text>

      <Text style={{ ...text, fontSize: "12px", color: "#cbd5e1", wordBreak: "break-all" as const }}>
        Or copy this link: {resetUrl}
      </Text>
    </EmailLayout>
  );
};

export default PasswordResetEmail;

const resetButton = {
  backgroundColor: "#0F6B46",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
  margin: "16px 0",
};
