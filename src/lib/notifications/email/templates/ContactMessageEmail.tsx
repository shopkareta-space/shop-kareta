import {
  Heading,
  Text
} from "@react-email/components";
import * as React from "react";
import { EmailLayout, h1, text } from "./EmailLayout";

export const ContactMessageEmail = ({ name = "Customer" }: { name?: string }) => {
  return (
    <EmailLayout previewText="We received your message">
      <Heading style={h1}>Message Received</Heading>
      
      <Text style={text}>
        Hi {name},
      </Text>
      <Text style={text}>
        Thank you for reaching out to Shop Kareta! We have received your message and our support team will get back to you as soon as possible.
      </Text>
      <Text style={text}>
        Typically, we respond within 24-48 hours. We appreciate your patience.
      </Text>
    </EmailLayout>
  );
};

export default ContactMessageEmail;
