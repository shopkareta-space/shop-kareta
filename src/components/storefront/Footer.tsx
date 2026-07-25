import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-brand-blue text-brand-light pt-16 pb-8 border-t-4 border-brand-green">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <Image 
                src="/logos/sk-holding-logo.svg" 
                alt="SK Holdings Logo" 
                width={200} 
                height={60} 
                className="h-12 w-auto" 
              />
            </div>
            <p className="text-brand-light/80 text-sm leading-relaxed">
              Your premium destination for authentic Ayurvedic and wellness products. Quality you can trust, delivered to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-6 text-brand-gold">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/shop" className="text-brand-light/80 hover:text-brand-light text-sm transition-colors">Shop All Products</Link>
              </li>
              <li>
                <Link href="/categories" className="text-brand-light/80 hover:text-brand-light text-sm transition-colors">Categories</Link>
              </li>
              <li>
                <Link href="/about" className="text-brand-light/80 hover:text-brand-light text-sm transition-colors">About SK Holdings</Link>
              </li>
              <li>
                <Link href="/contact" className="text-brand-light/80 hover:text-brand-light text-sm transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-6 text-brand-gold">Customer Care</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-brand-light/80 hover:text-brand-light text-sm transition-colors">FAQs</Link>
              </li>
              <li>
                <Link href="/shipping" className="text-brand-light/80 hover:text-brand-light text-sm transition-colors">Shipping & Delivery</Link>
              </li>
              <li>
                <Link href="/returns" className="text-brand-light/80 hover:text-brand-light text-sm transition-colors">Returns & Refunds</Link>
              </li>
              <li>
                <Link href="/track-order" className="text-brand-light/80 hover:text-brand-light text-sm transition-colors">Track Order</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-6 text-brand-gold">Get in Touch</h3>
            <ul className="space-y-4 text-sm text-brand-light/80">
              <li className="flex items-start gap-3">
                <span className="font-medium text-brand-light">Address:</span>
                <span>SK Holdings Pvt. Ltd.<br />Mumbai, Maharashtra, India</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="font-medium text-brand-light">Email:</span>
                <a href="mailto:support@shopkareta.com" className="hover:text-brand-light transition-colors">support@shopkareta.com</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="font-medium text-brand-light">Phone:</span>
                <a href="tel:+911234567890" className="hover:text-brand-light transition-colors">+91 12345 67890</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-brand-light/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-brand-light/60">
          <p>© {new Date().getFullYear()} SK Holdings Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-brand-light transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-light transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
