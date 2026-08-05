import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Shop Kareta",
  description: "Privacy Policy for Shop Kareta",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col bg-brand-light min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#0D1B2A] py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">
            Privacy Policy
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
          <span className="text-brand-blue font-medium">Privacy Policy</span>
        </nav>

        <article className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-brand-gray/10 text-brand-gray space-y-8 leading-relaxed">
          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-blue mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to Shop Kareta ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-blue mb-4">2. The Data We Collect About You</h2>
            <p className="mb-4">
              Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-brand-gray/90">
              <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data:</strong> includes billing address, delivery address, email address, and telephone numbers.</li>
              <li><strong>Financial Data:</strong> includes payment card details (processed securely by our payment partners).</li>
              <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-blue mb-4">3. How We Use Your Personal Data</h2>
            <p className="mb-4">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-brand-gray/90">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., fulfilling an order).</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal or regulatory obligation.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-blue mb-4">4. Data Security</h2>
            <p className="mb-4">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-brand-blue mb-4">5. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, including any requests to exercise your legal rights, please contact us using the details set out below:
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
