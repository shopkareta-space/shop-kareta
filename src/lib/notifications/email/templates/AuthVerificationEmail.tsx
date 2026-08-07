import {
  Heading,
  Text,
  Section,
  Hr,
} from "@react-email/components";
import * as React from "react";
import { EmailLayout, h1, text } from "./EmailLayout";

interface AuthVerificationEmailProps {
  customerName?: string;
  otp: string;
  expiresInMinutes?: number;
}

export const AuthVerificationEmail = ({
  customerName = "there",
  otp,
  expiresInMinutes = 10,
}: AuthVerificationEmailProps) => {
  return (
    <EmailLayout previewText="Your Shop Kareta verification code">
      <Heading style={h1}>Verify Your Email Address</Heading>

      <Text style={text}>Hi {customerName},</Text>
      <Text style={text}>
        Thank you for creating your Shop Kareta account! Use the code below to
        verify your email address. This code expires in{" "}
        <strong>{expiresInMinutes} minutes</strong>.
      </Text>

      {/* OTP Box */}
      <Section style={otpContainer}>
        <Text style={otpCode}>{otp}</Text>
        <Text style={otpLabel}>Verification Code</Text>
      </Section>

      <Hr style={{ borderColor: "#e2e8f0", margin: "24px 0" }} />

      <Text style={{ ...text, fontSize: "14px", color: "#94a3b8" }}>
        If you did not create a Shop Kareta account, you can safely ignore this
        email. Your security is our priority — never share this code with anyone.
      </Text>
    </EmailLayout>
  );
};

export default AuthVerificationEmail;

// Styles
const otpContainer = {
  backgroundColor: "#f0fdf4",
  border: "2px solid #0F6B46",
  borderRadius: "12px",
  padding: "24px",
  textAlign: "center" as const,
  margin: "24px 0",
};

const otpCode = {
  color: "#0F6B46",
  fontSize: "48px",
  fontWeight: "900",
  letterSpacing: "12px",
  margin: "0",
  fontFamily: "monospace",
};

const otpLabel = {
  color: "#64748b",
  fontSize: "13px",
  letterSpacing: "2px",
  textTransform: "uppercase" as const,
  margin: "8px 0 0 0",
};
