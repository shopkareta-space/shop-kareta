import {
  Heading,
  Text,
  Button,
  Section
} from "@react-email/components";
import * as React from "react";
import { EmailLayout, h1, text, button } from "./EmailLayout";

interface AdminNotificationEmailProps {
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
  details?: Record<string, string>;
}

export const AdminNotificationEmail = ({ 
  title = "New Notification",
  message = "You have a new notification from Shop Kareta.",
  actionUrl,
  actionText = "View Details",
  details
}: AdminNotificationEmailProps) => {
  return (
    <EmailLayout previewText={`Admin Alert: ${title}`}>
      <Heading style={h1}>{title}</Heading>
      
      <Text style={text}>{message}</Text>

      {details && Object.keys(details).length > 0 && (
        <Section style={box}>
          {Object.entries(details).map(([key, value]) => (
            <Text key={key} style={boxText}>
              <strong>{key}:</strong> {value}
            </Text>
          ))}
        </Section>
      )}

      {actionUrl && (
        <Section style={{ textAlign: "center", marginTop: "32px", marginBottom: "32px" }}>
          <Button href={actionUrl} style={button}>
            {actionText}
          </Button>
        </Section>
      )}
    </EmailLayout>
  );
};

export default AdminNotificationEmail;

const box = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "16px",
  marginTop: "24px",
};

const boxText = {
  color: "#0f172a",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 4px 0",
};
