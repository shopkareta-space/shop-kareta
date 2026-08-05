import Link from "next/link";
import { Phone, Mail, MessageCircle, MapPin, Sparkles, Clock, Truck, ShieldCheck, HelpCircle } from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";
import { ContactForm } from "@/components/storefront/ContactForm";

export const metadata = {
  title: "Contact Us | Shop Kareta",
  description: "Get in touch with Shop Kareta. We are here to help you with your premium wellness and Ayurvedic needs.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col bg-brand-light">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-[#0D1B2A] py-24 flex items-center">
        <div className="absolute inset-0 bg-brand-green/5 -z-10 pattern-dots opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0D1B2A] z-0" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <BlurFade delay={0.1}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 text-brand-gold font-semibold tracking-wider uppercase text-sm mb-6 border border-brand-gold/20">
              <Sparkles className="w-4 h-4" /> We're Here to Help
            </span>
          </BlurFade>
          
          <BlurFade delay={0.2}>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Contact Us
            </h1>
          </BlurFade>
          
          <BlurFade delay={0.3}>
            <p className="text-white/80 text-lg max-w-xl mx-auto font-light">
              Have a question about our products, delivery, or your order? Reach out to our dedicated support team.
            </p>
          </BlurFade>
        </div>
      </section>

      <section className="py-20 bg-brand-light">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* Left Column: Info Cards & Delivery */}
            <div className="w-full lg:w-5/12 space-y-8">
              <BlurFade delay={0.2}>
                <h2 className="font-heading text-3xl font-bold text-brand-blue mb-6">Get in Touch</h2>
                
                {/* 2. Contact Cards */}
                <div className="space-y-4">
                  {/* Address */}
                  <a href="https://maps.app.goo.gl/kxa71zykRTGC99H47" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-5 p-6 bg-white rounded-3xl border border-brand-gray/10 hover:border-brand-blue/30 hover:shadow-xl transition-all">
                    <div className="w-14 h-14 bg-brand-blue/5 text-brand-blue group-hover:bg-brand-blue group-hover:text-white rounded-2xl flex items-center justify-center transition-colors shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-brand-gray font-semibold uppercase tracking-wider mb-2">Official Address</p>
                      <p className="text-sm font-medium text-brand-blue leading-relaxed mb-3">
                        Shop Kareta<br />
                        204, Third Floor, Indraprastha Apartment,<br />
                        Pawansut Nagar, Near HP Gas Godown,<br />
                        Ramna Maroti, Nandanvan,<br />
                        Nagpur, Maharashtra – 440009
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-green bg-brand-green/10 px-3 py-1.5 rounded-lg group-hover:bg-brand-green group-hover:text-white transition-colors">
                        Get Directions &rarr;
                      </span>
                    </div>
                  </a>

                  {/* Phone */}
                  <a href="tel:+919529285971" className="group flex items-center gap-5 p-6 bg-white rounded-3xl border border-brand-gray/10 hover:border-brand-green/30 hover:shadow-xl transition-all">
                    <div className="w-14 h-14 bg-brand-blue/5 text-brand-blue group-hover:bg-brand-blue group-hover:text-white rounded-2xl flex items-center justify-center transition-colors shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-brand-gray font-semibold uppercase tracking-wider mb-1">Customer Care / Phone</p>
                      <p className="text-lg font-bold text-brand-blue">+91 95292 85971</p>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a href="https://wa.me/919529285971" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-5 p-6 bg-white rounded-3xl border border-brand-gray/10 hover:border-[#25D366]/30 hover:shadow-xl transition-all">
                    <div className="w-14 h-14 bg-[#25D366]/10 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white rounded-2xl flex items-center justify-center transition-colors shrink-0">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-brand-gray font-semibold uppercase tracking-wider mb-1">WhatsApp Support</p>
                      <p className="text-lg font-bold text-[#0D1B2A]">+91 95292 85971</p>
                    </div>
                  </a>

                  {/* Email */}
                  <a href="mailto:shopkareta@gmail.com" className="group flex items-center gap-5 p-6 bg-white rounded-3xl border border-brand-gray/10 hover:border-brand-gold/30 hover:shadow-xl transition-all">
                    <div className="w-14 h-14 bg-brand-gold/10 text-brand-gold group-hover:bg-brand-gold group-hover:text-white rounded-2xl flex items-center justify-center transition-colors shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-brand-gray font-semibold uppercase tracking-wider mb-1">Email Address</p>
                      <p className="text-lg font-bold text-brand-blue">shopkareta@gmail.com</p>
                    </div>
                  </a>
                </div>
              </BlurFade>

              {/* 3. Delivery Information */}
              <BlurFade delay={0.3} className="pt-8 border-t border-brand-gray/10">
                <h3 className="font-heading text-xl font-bold text-brand-blue mb-4">Delivery Information</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-brand-gray/10">
                    <Truck className="w-6 h-6 text-brand-green" />
                    <span className="font-medium text-brand-blue">Free Home Delivery</span>
                  </div>
                  <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-brand-gray/10">
                    <ShieldCheck className="w-6 h-6 text-brand-gold" />
                    <span className="font-medium text-brand-blue">7 Days Money Back Return Policy</span>
                  </div>
                  <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-brand-gray/10">
                    <Clock className="w-6 h-6 text-brand-blue" />
                    <span className="font-medium text-brand-blue">Delivery Time: 3–7 Business Days</span>
                  </div>
                </div>
              </BlurFade>

              {/* 6. FAQ Preview */}
              <BlurFade delay={0.4} className="pt-8 border-t border-brand-gray/10">
                <div className="bg-brand-blue/5 p-6 rounded-3xl flex items-start gap-4">
                  <HelpCircle className="w-8 h-8 text-brand-blue shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-brand-blue mb-2">Have common questions?</h4>
                    <p className="text-sm text-brand-gray mb-3">Check out our FAQ page to find quick answers about shipping, returns, and products.</p>
                    {/* Placeholder for FAQ link */}
                    <span className="text-brand-green font-semibold text-sm hover:underline cursor-pointer">
                      Read our FAQs &rarr;
                    </span>
                  </div>
                </div>
              </BlurFade>
            </div>

            {/* Right Column: Contact Form */}
            <div className="w-full lg:w-7/12">
              <BlurFade delay={0.3}>
                <div className="mb-6">
                  <h2 className="font-heading text-3xl font-bold text-brand-blue mb-2">Send us a Message</h2>
                  <p className="text-brand-gray">Fill out the form below and our team will get back to you within 24 hours.</p>
                </div>
                {/* 4. Contact Form Component */}
                <ContactForm />
              </BlurFade>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
