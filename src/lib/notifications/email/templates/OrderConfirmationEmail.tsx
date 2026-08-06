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
    phone?: string;
  };
  items: Array<{
    name: string;
    variant_name?: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  orderDate: string;
  paymentMethod: string;
  paymentStatus: string;
  estimatedDelivery: string;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
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
    pincode: "400001",
    phone: "9876543210"
  },
  items = [],
  orderDate = new Date().toLocaleDateString(),
  paymentMethod = "cod",
  paymentStatus = "pending",
  estimatedDelivery = "3-5 Business Days",
  subtotal = 0,
  shippingCost = 0,
  discountAmount = 0
}: OrderConfirmationEmailProps) => {
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);

  const formattedTotal = formatCurrency(totalAmount);

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
          <strong>Order Date:</strong> {orderDate}<br />
          <strong>Payment Method:</strong> {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}<br />
          <strong>Payment Status:</strong> <span style={{ textTransform: 'capitalize' }}>{paymentStatus}</span><br />
          <strong>Estimated Delivery:</strong> {estimatedDelivery}<br />
          <strong>Order Total:</strong> {formattedTotal}<br />
        </Text>
      </Section>

      <Section style={{ textAlign: "center", marginBottom: "20px" }}>
        <Button href={`https://shopkareta.com/track/${orderId}`} style={button}>
          Track Order
        </Button>
        <span style={{ margin: "0 10px" }}></span>
        <Button href={`https://shopkareta.com/shop`} style={{...button, backgroundColor: "#f1f5f9", color: "#0f172a", border: "1px solid #cbd5e1"}}>
          Continue Shopping
        </Button>
      </Section>

      <Hr style={hr} />

      <Heading as="h2" style={h2}>Shipping Address</Heading>
      <Text style={text}>
        {shippingAddress.full_name && <strong>{shippingAddress.full_name}<br /></strong>}
        {shippingAddress.phone && <>{shippingAddress.phone}<br /></>}
        {shippingAddress.addressLine1}<br />
        {shippingAddress.addressLine2 && <>{shippingAddress.addressLine2}<br /></>}
        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}
      </Text>

      <Hr style={hr} />

      <Heading as="h2" style={h2}>Order Summary</Heading>
      <Section>
        {items.map((item, index) => (
          <Row key={index} style={{ marginBottom: "15px" }}>
            <Column style={{ width: "60px" }}>
              {item.image && (
                <img src={item.image} alt={item.name} width="50" height="50" style={{ borderRadius: "4px", objectFit: "cover" }} />
              )}
            </Column>
            <Column style={{ width: "65%", paddingLeft: "10px" }}>
              <Text style={{ ...itemText, fontWeight: "bold" }}>{item.name}</Text>
              {item.variant_name && <Text style={{ ...itemText, fontSize: "12px", color: "#64748b" }}>Variant: {item.variant_name}</Text>}
              <Text style={{ ...itemText, fontSize: "12px", color: "#64748b" }}>Qty: {item.quantity} x {formatCurrency(item.price)}</Text>
            </Column>
            <Column align="right">
              <Text style={{ ...itemText, fontWeight: "bold" }}>{formatCurrency(item.price * item.quantity)}</Text>
            </Column>
          </Row>
        ))}
        
        <Section style={{ marginTop: "20px", borderTop: "1px solid #e2e8f0", paddingTop: "15px" }}>
          <Row style={{ marginBottom: "8px" }}>
            <Column style={{ width: "80%" }}>
              <Text style={itemText}>Subtotal</Text>
            </Column>
            <Column align="right">
              <Text style={itemText}>{formatCurrency(subtotal)}</Text>
            </Column>
          </Row>
          
          <Row style={{ marginBottom: "8px" }}>
            <Column style={{ width: "80%" }}>
              <Text style={itemText}>Shipping</Text>
            </Column>
            <Column align="right">
              <Text style={itemText}>{shippingCost > 0 ? formatCurrency(shippingCost) : "Free"}</Text>
            </Column>
          </Row>

          {discountAmount > 0 && (
            <Row style={{ marginBottom: "8px" }}>
              <Column style={{ width: "80%" }}>
                <Text style={{ ...itemText, color: "#16a34a" }}>Discount</Text>
              </Column>
              <Column align="right">
                <Text style={{ ...itemText, color: "#16a34a" }}>-{formatCurrency(discountAmount)}</Text>
              </Column>
            </Row>
          )}

          <Row style={{ marginTop: "12px", borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}>
            <Column style={{ width: "80%" }}>
              <Text style={{ ...itemText, fontWeight: "bold", fontSize: "16px", color: "#0f172a" }}>Grand Total</Text>
            </Column>
            <Column align="right">
              <Text style={{ ...itemText, fontWeight: "bold", fontSize: "16px", color: "#0f172a" }}>{formattedTotal}</Text>
            </Column>
          </Row>
        </Section>
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
