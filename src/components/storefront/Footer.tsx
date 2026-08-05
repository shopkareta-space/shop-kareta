import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MessageCircle, Truck, ShieldCheck, Clock, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0D1B2A] text-brand-light pt-16 pb-8 border-t-4 border-brand-green">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <Image 
                src="/logos/sk-holding-logo.svg" 
                alt="SK Holdings Logo" 
                width={200} 
                height={60} 
                className="h-12 w-auto" 
              />
            </div>
            <p className="text-brand-light/80 text-sm leading-relaxed max-w-sm">
              Your premium destination for authentic Ayurvedic and wellness products. Quality you can trust, delivered to your doorstep.
            </p>
            
            {/* Delivery Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-brand-light/90">
                <Truck className="w-4 h-4 text-brand-green" />
                <span>Free Home Delivery</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-brand-light/90">
                <ShieldCheck className="w-4 h-4 text-brand-gold" />
                <span>7 Days Money Back Return</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-brand-light/90">
                <Clock className="w-4 h-4 text-brand-blue" />
                <span>Delivery in 3–7 Days</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-6 text-brand-gold">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-brand-light/80 hover:text-brand-light text-sm transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/shop" className="text-brand-light/80 hover:text-brand-light text-sm transition-colors">Shop</Link>
              </li>
              <li>
                <Link href="/categories" className="text-brand-light/80 hover:text-brand-light text-sm transition-colors">Categories</Link>
              </li>
              <li>
                <Link href="/about" className="text-brand-light/80 hover:text-brand-light text-sm transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="text-brand-light/80 hover:text-brand-light text-sm transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-6 text-brand-gold">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/shipping" className="text-brand-light/80 hover:text-brand-light text-sm transition-colors">Shipping Policy</Link>
              </li>
              <li>
                <Link href="/refunds" className="text-brand-light/80 hover:text-brand-light text-sm transition-colors">Refund Policy</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-brand-light/80 hover:text-brand-light text-sm transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="text-brand-light/80 hover:text-brand-light text-sm transition-colors">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-6 text-brand-gold">Contact</h3>
            <ul className="space-y-4 text-sm text-brand-light/80">
              <li className="flex items-start gap-3 hover:text-brand-light transition-colors">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Shop+Kareta+204+Third+Floor+Indraprastha+Apartment+Pawansut+Nagar+Near+HP+Gas+Godown+Ramna+Maroti+Nandanvan+Nagpur+Maharashtra+440009" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="leading-relaxed block"
                >
                  Shop Kareta, 204, Third Floor,<br />
                  Indraprastha Apartment,<br />
                  Pawansut Nagar, Near HP Gas Godown,<br />
                  Ramna Maroti, Nandanvan,<br />
                  Nagpur, Maharashtra – 440009
                </a>
              </li>
              <li className="flex items-center gap-3 hover:text-brand-light transition-colors">
                <Phone className="w-4 h-4 shrink-0" />
                <a href="tel:+919529285971">+91 95292 85971</a>
              </li>
              <li className="flex items-center gap-3 hover:text-[#25D366] transition-colors">
                <MessageCircle className="w-4 h-4 shrink-0" />
                <a href="https://wa.me/919529285971" target="_blank" rel="noopener noreferrer">+91 95292 85971</a>
              </li>
              <li className="flex items-center gap-3 hover:text-brand-light transition-colors">
                <Mail className="w-4 h-4 shrink-0" />
                <a href="mailto:shopkareta@gmail.com">shopkareta@gmail.com</a>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex gap-4 mt-8">
              <a href="https://www.instagram.com/vediquenutrition/?hl=en" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-green hover:text-white transition-all text-brand-light/80">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61591997745683" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all text-brand-light/80">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-brand-light/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-brand-light/60">
          <p>© {new Date().getFullYear()} Shop Kareta. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
