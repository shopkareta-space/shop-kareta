import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface OrderConfirmationEmailProps {
  customerName: string;
  orderId: string;
  deliveryId: string;
  totalAmount: number;
  shippingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
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
    <Html>
      <Head />
      <Preview>Your Shopkareta Order #{deliveryId} is confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Order Confirmed!</Heading>
          
          <Text style={text}>
            Hi {customerName},
          </Text>
          <Text style={text}>
            Thank you for shopping with Shopkareta! We've received your order and are getting it ready for shipment.
          </Text>
          
          <Section style={box}>
            <Text style={boxText}>
              <strong>Delivery ID:</strong> {deliveryId}<br />
              <strong>Order Total:</strong> {formattedTotal}<br />
              <strong>Payment Method:</strong> Cash on Delivery
            </Text>
          </Section>

          <Hr style={hr} />

          <Heading as="h2" style={h2}>Shipping Address</Heading>
          <Text style={text}>
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
            <Row style={{ marginTop: "20px", borderTop: "1px solid #e6ebf1", paddingTop: "10px" }}>
              <Column style={{ width: "80%" }}>
                <Text style={{ ...itemText, fontWeight: "bold" }}>Total</Text>
              </Column>
              <Column align="right">
                <Text style={{ ...itemText, fontWeight: "bold" }}>{formattedTotal}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />
          
          <Text style={footer}>
            If you have any questions about your order, please reply to this email or contact us at support@shopkareta.com.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmationEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  marginBottom: "64px",
  borderRadius: "8px",
};

const h1 = {
  color: "#152a60",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 20px 0",
  padding: "0",
};

const h2 = {
  color: "#152a60",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 10px 0",
};

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 15px 0",
};

const itemText = {
  color: "#525f7f",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
};

const box = {
  backgroundColor: "#f6f9fc",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
};

const boxText = {
  color: "#152a60",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  marginTop: "20px",
};
