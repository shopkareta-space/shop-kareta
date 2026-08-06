import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
  Img
} from "@react-email/components";
import * as React from "react";

interface EmailLayoutProps {
  previewText: string;
  children: React.ReactNode;
}

export const EmailLayout = ({ previewText, children }: EmailLayoutProps) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>Shop Kareta</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            {children}
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              <strong>Need help?</strong><br />
              Customer Care: 9529285971<br />
              Email: <Link href="mailto:shopkareta@gmail.com" style={link}>shopkareta@gmail.com</Link>
            </Text>
            <Text style={footerText}>
              <Link href="https://instagram.com/shopkareta" style={link}>Instagram</Link> •{" "}
              <Link href="https://facebook.com/shopkareta" style={link}>Facebook</Link>
            </Text>
            <Text style={footerCopyright}>
              &copy; {new Date().getFullYear()} Shop Kareta. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Common Styles
export const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

export const container = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  maxWidth: "600px",
};

const header = {
  backgroundColor: "#0D1B2A", // Brand Dark Blue
  padding: "24px 32px",
  textAlign: "center" as const,
};

const logoText = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: 0,
  letterSpacing: "1px",
};

const content = {
  padding: "32px",
};

export const h1 = {
  color: "#0D1B2A",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 20px 0",
};

export const text = {
  color: "#475569",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px 0",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "0",
};

const footer = {
  padding: "24px 32px",
  backgroundColor: "#f8fafc",
  textAlign: "center" as const,
};

const footerText = {
  color: "#64748b",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 8px 0",
};

const footerCopyright = {
  color: "#94a3b8",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "16px 0 0 0",
};

export const link = {
  color: "#3b82f6",
  textDecoration: "none",
};

export const button = {
  backgroundColor: "#0D1B2A",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  margin: "16px 0",
};
