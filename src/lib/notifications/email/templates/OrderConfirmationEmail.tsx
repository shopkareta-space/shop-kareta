import {
  Heading,
  Section,
  Text,
  Hr,
  Row,
  Column,
  Button
} from "@react-email/components";
import * as React from "react";
import { EmailLayout, h1, text, button } from "./EmailLayout";

interface OrderConfirmationEmailProps {
  customerName: string;
  orderId: string;
  deliveryId: string;
  totalAmount: number;
  shippingAddress: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    full_name?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
}

export const OrderConfirmationEmail = ({
  customerName = "Customer",
  orderId = "SK-ORD-000",
  deliveryId = "SK-DEL-000",
  totalAmount = 0,
  shippingAddress = {
    addressLine1: "123 Main St",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  },
  items = []
}: OrderConfirmationEmailProps) => {
  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(totalAmount);

  return (
    <EmailLayout previewText={`Your Shop Kareta Order #${deliveryId} is confirmed!`}>
      <Heading style={h1}>Order Confirmed!</Heading>
      
      <Text style={text}>
        Hi {customerName},
      </Text>
      <Text style={text}>
        Thank you for shopping with Shop Kareta! We&apos;ve received your order and are getting it ready for shipment.
      </Text>
      
      <Section style={box}>
        <Text style={boxText}>
          <strong>Order Number:</strong> {deliveryId}<br />
          <strong>Order Total:</strong> {formattedTotal}<br />
        </Text>
      </Section>

      <Section style={{ textAlign: "center", marginBottom: "20px" }}>
        <Button href={`https://shopkareta.com/track/${orderId}`} style={button}>
          Track Order
        </Button>
        <span style={{ margin: "0 10px" }}></span>
        <Button href={`https://shopkareta.com/invoice/${orderId}`} style={{...button, backgroundColor: "#f1f5f9", color: "#0f172a", border: "1px solid #cbd5e1"}}>
          View Invoice
        </Button>
      </Section>

      <Hr style={hr} />

      <Heading as="h2" style={h2}>Shipping Address</Heading>
      <Text style={text}>
        {shippingAddress.full_name && <>{shippingAddress.full_name}<br /></>}
        {shippingAddress.addressLine1}<br />
        {shippingAddress.addressLine2 && <>{shippingAddress.addressLine2}<br /></>}
        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}
      </Text>

      <Hr style={hr} />

      <Heading as="h2" style={h2}>Order Summary</Heading>
      <Section>
        {items.map((item, index) => (
          <Row key={index} style={{ marginBottom: "10px" }}>
            <Column style={{ width: "80%" }}>
              <Text style={itemText}>{item.name} x {item.quantity}</Text>
            </Column>
            <Column align="right">
              <Text style={itemText}>₹{item.price * item.quantity}</Text>
            </Column>
          </Row>
        ))}
        <Row style={{ marginTop: "20px", borderTop: "1px solid #e2e8f0", paddingTop: "10px" }}>
          <Column style={{ width: "80%" }}>
            <Text style={{ ...itemText, fontWeight: "bold" }}>Total</Text>
          </Column>
          <Column align="right">
            <Text style={{ ...itemText, fontWeight: "bold" }}>{formattedTotal}</Text>
          </Column>
        </Row>
      </Section>
    </EmailLayout>
  );
};

export default OrderConfirmationEmail;

const h2 = {
  color: "#0D1B2A",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 12px 0",
};

const itemText = {
  color: "#475569",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
};

const box = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "24px",
};

const boxText = {
  color: "#0f172a",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "24px 0",
};
