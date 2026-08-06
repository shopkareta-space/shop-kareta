import {
  Heading,
  Text,
  Button,
  Section
} from "@react-email/components";
import * as React from "react";
import { EmailLayout, h1, text, button } from "./EmailLayout";

interface OrderStatusEmailProps {
  customerName: string;
  orderId: string;
  status: string; // 'processing', 'packed', 'shipped', 'delivered', 'cancelled'
  trackingNumber?: string;
  courier?: string;
  trackingUrl?: string;
}

export const OrderStatusEmail = ({
  customerName = "Customer",
  orderId = "SK-ORD-000",
  status = "processing",
  trackingNumber,
  courier,
  trackingUrl
}: OrderStatusEmailProps) => {
  let title = "Order Update";
  let message = `There is an update on your order #${orderId.split('-')[0].toUpperCase()}.`;
  let showTracking = false;

  switch (status.toLowerCase()) {
    case 'processing':
      title = "We are processing your order";
      message = "Your order is currently being processed by our team. We'll notify you as soon as it's packed and ready to ship.";
      break;
    case 'packed':
      title = "Your order is packed";
      message = "Great news! Your order is packed and waiting to be picked up by our delivery partner.";
      break;
    case 'shipped':
      title = "Your order has been shipped!";
      message = "Your order has been dispatched and is on its way to you.";
      showTracking = true;
      break;
    case 'delivered':
      title = "Your order has been delivered";
      message = "Your order has been successfully delivered. We hope you love your purchase! Thank you for shopping with Shop Kareta.";
      break;
    case 'cancelled':
      title = "Order Cancelled";
      message = "Your order has been cancelled. If a payment was made, a refund will be initiated shortly.";
      break;
  }

  return (
    <EmailLayout previewText={`${title} - Order #${orderId.split('-')[0].toUpperCase()}`}>
      <Heading style={h1}>{title}</Heading>
      
      <Text style={text}>
        Hi {customerName},
      </Text>
      <Text style={text}>
        {message}
      </Text>

      {showTracking && (trackingNumber || trackingUrl) && (
        <Section style={box}>
          {courier && <Text style={boxText}><strong>Courier:</strong> {courier}</Text>}
          {trackingNumber && <Text style={boxText}><strong>Tracking Number:</strong> {trackingNumber}</Text>}
          {trackingUrl && (
            <Button href={trackingUrl} style={{...button, marginTop: "16px"}}>
              Track Package
            </Button>
          )}
        </Section>
      )}

      {status !== 'cancelled' && !trackingUrl && (
        <Section style={{ textAlign: "center", marginTop: "24px" }}>
          <Button href={`https://shopkareta.com/track/${orderId}`} style={button}>
            View Order Status
          </Button>
        </Section>
      )}
    </EmailLayout>
  );
};

export default OrderStatusEmail;

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
  margin: "0",
};
