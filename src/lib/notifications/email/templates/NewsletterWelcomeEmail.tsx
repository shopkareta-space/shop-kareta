import {
  Heading,
  Text,
  Button,
  Section
} from "@react-email/components";
import * as React from "react";
import { EmailLayout, h1, text, button } from "./EmailLayout";

export const NewsletterWelcomeEmail = () => {
  return (
    <EmailLayout previewText="Thank you for subscribing!">
      <Heading style={h1}>Welcome to the Club!</Heading>
      
      <Text style={text}>
        Thank you for subscribing to the Shop Kareta newsletter.
      </Text>
      <Text style={text}>
        You&apos;re now on the list to receive exclusive offers, early access to sales, and updates on our latest products straight to your inbox.
      </Text>

      <Section style={{ textAlign: "center", marginTop: "32px", marginBottom: "32px" }}>
        <Button href="https://shopkareta.com/shop" style={button}>
          Explore Our Products
        </Button>
      </Section>
    </EmailLayout>
  );
};

export default NewsletterWelcomeEmail;
