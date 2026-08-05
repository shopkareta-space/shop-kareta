import Link from "next/link";
import { ChevronRight, ShieldCheck, RefreshCw } from "lucide-react";

export const metadata = {
  title: "Refund & Return Policy | Shop Kareta",
  description: "Refund and Return Policy for Shop Kareta",
};

export default function RefundsPage() {
  return (
    <div className="flex flex-col bg-brand-light min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#0D1B2A] py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">
            Refund & Return Policy
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
          <span className="text-brand-blue font-medium">Refund & Return Policy</span>
        </nav>

        <article className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-brand-gray/10 text-brand-gray space-y-8 leading-relaxed">
          {/* Highlights */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-brand-gold/10 p-6 rounded-2xl mb-8">
            <ShieldCheck className="w-8 h-8 text-brand-gold shrink-0" />
            <div>
              <h3 className="font-heading font-bold text-brand-blue">7-Day Money Back Guarantee</h3>
              <p className="text-sm text-brand-gray">Shop with confidence. If you're not satisfied, we've got you covered.</p>
            </div>
          </div>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-blue mb-4">1. Return Eligibility</h2>
            <p className="mb-4">
              We offer a <strong>7-Day Money Back Return Policy</strong> on all eligible items. To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-blue mb-4">2. Initiation Process</h2>
            <p className="mb-4">
              To start a return, you can contact us at our customer support channels. If your return is accepted, we'll send you instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-blue mb-4">3. Refunds</h2>
            <p className="mb-4">
              We will notify you once we've received and inspected your return, and let you know if the refund was approved or not. If approved, you'll be automatically refunded on your original payment method within a certain amount of days. Please remember it can take some time for your bank or credit card company to process and post the refund too.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-blue mb-4">4. Damages and Issues</h2>
            <p className="mb-4">
              Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-blue mb-4">5. Contact Information</h2>
            <p className="mb-4">
              To request a return or if you have any questions regarding refunds, please contact us:
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
