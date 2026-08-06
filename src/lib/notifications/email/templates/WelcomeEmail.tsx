import {
  Heading,
  Text,
  Button,
  Section
} from "@react-email/components";
import * as React from "react";
import { EmailLayout, h1, text, button } from "./EmailLayout";

export const WelcomeEmail = ({ customerName = "there" }: { customerName?: string }) => {
  return (
    <EmailLayout previewText="Welcome to Shop Kareta!">
      <Heading style={h1}>Welcome to Shop Kareta!</Heading>
      
      <Text style={text}>
        Hi {customerName},
      </Text>
      <Text style={text}>
        We&apos;re thrilled to have you here! Shop Kareta is your one-stop destination for the best products at the best prices.
      </Text>
      <Text style={text}>
        Your account has been successfully created. You can now log in to track your orders, manage your addresses, and enjoy a seamless shopping experience.
      </Text>

      <Section style={{ textAlign: "center", marginTop: "32px", marginBottom: "32px" }}>
        <Button href="https://shopkareta.com/shop" style={button}>
          Start Shopping
        </Button>
      </Section>
    </EmailLayout>
  );
};

export default WelcomeEmail;
