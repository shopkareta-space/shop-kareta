import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | Shop Kareta",
  description: "Terms and Conditions for Shop Kareta",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col bg-brand-light min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#0D1B2A] py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">
            Terms & Conditions
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
          <span className="text-brand-blue font-medium">Terms & Conditions</span>
        </nav>

        <article className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-brand-gray/10 text-brand-gray space-y-8 leading-relaxed">
          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-blue mb-4">1. Agreement to Terms</h2>
            <p className="mb-4">
              By accessing and using our website, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services. We reserve the right to update or modify these terms at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-blue mb-4">2. Products and Services</h2>
            <p className="mb-4">
              All products listed on Shop Kareta are subject to availability. We reserve the right to discontinue any product at any time. Prices for our products are subject to change without notice. We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-blue mb-4">3. Delivery & Shipping</h2>
            <ul className="list-disc pl-6 space-y-2 text-brand-gray/90">
              <li>We offer <strong>Free Home Delivery</strong> on all eligible orders.</li>
              <li>Standard delivery times vary between <strong>3 to 7 Business Days</strong>.</li>
              <li>We strive to ensure timely delivery but are not liable for delays caused by unforeseen logistical challenges.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-blue mb-4">4. User Obligations</h2>
            <p className="mb-4">
              When creating an account or placing an order, you agree to provide current, complete, and accurate purchase and account information. You agree to promptly update your account and other information, including your email address and credit card numbers and expiration dates, so that we can complete your transactions and contact you as needed.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-blue mb-4">5. Contact Information</h2>
            <p className="mb-4">
              For any questions regarding these Terms and Conditions, please reach out to us:
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
