import Link from "next/link";
import { ChevronRight, Truck, Clock } from "lucide-react";

export const metadata = {
  title: "Shipping Policy | Shop Kareta",
  description: "Shipping and Delivery Policy for Shop Kareta",
};

export default function ShippingPage() {
  return (
    <div className="flex flex-col bg-brand-light min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#0D1B2A] py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">
            Shipping Policy
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Last Updated: July 28, 2026
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-brand-gray mb-12">
          <Link href="/" className="hover:text-brand-green transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-brand-blue font-medium">Shipping Policy</span>
        </nav>

        <article className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-brand-gray/10 text-brand-gray space-y-8 leading-relaxed">
          {/* Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-4 bg-brand-green/10 p-6 rounded-2xl">
              <Truck className="w-8 h-8 text-brand-green" />
              <div>
                <h3 className="font-heading font-bold text-brand-blue">Free Home Delivery</h3>
                <p className="text-sm text-brand-gray">On all eligible orders</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-brand-gold/10 p-6 rounded-2xl">
              <Clock className="w-8 h-8 text-brand-gold" />
              <div>
                <h3 className="font-heading font-bold text-brand-blue">Delivery Time</h3>
                <p className="text-sm text-brand-gray">3 to 7 Business Days</p>
              </div>
            </div>
          </div>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-blue mb-4">1. Order Processing Time</h2>
            <p className="mb-4">
              All orders are processed within 24 to 48 hours (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-blue mb-4">2. Shipping Rates and Estimates</h2>
            <p className="mb-4">
              We are proud to offer <strong>Free Home Delivery</strong> for our customers. Expected delivery timeframe is typically between <strong>3–7 Business Days</strong> depending on your location.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-blue mb-4">3. How do I check the status of my order?</h2>
            <p className="mb-4">
              When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-blue mb-4">4. Support & Queries</h2>
            <p className="mb-4">
              If you haven't received your order within 7 days of receiving your shipping confirmation email, please contact us with your name and order number, and we will look into it for you.
            </p>
            <ul className="space-y-2 text-brand-gray/90 bg-brand-light p-6 rounded-2xl">
              <li><strong>Email:</strong> shopkareta@gmail.com</li>
              <li><strong>Customer Care:</strong> +91 95292 85971</li>
              <li><strong>WhatsApp:</strong> +91 95292 85971</li>
            </ul>
          </section>
        </article>
      </div>
    </div>
  );
}
