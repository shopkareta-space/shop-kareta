import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Sparkles, Truck } from "lucide-react";
import ProductCard from "@/components/storefront/ProductCard";

export default function Homepage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-light">
        <div className="absolute inset-0 bg-brand-green/5 -z-10 pattern-dots" />
        <div className="container mx-auto px-4 py-20 lg:py-32 flex flex-col items-center text-center">
          <span className="text-brand-green font-semibold tracking-wider uppercase text-sm mb-6 flex items-center gap-2">
            <Leaf className="w-4 h-4" /> 100% Natural & Authentic
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold text-brand-blue mb-8 leading-tight max-w-4xl">
            Pure Ingredients,<br />
            <span className="text-brand-green">Healthy Life.</span>
          </h1>
          <p className="text-brand-gray text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            Your premium destination for doctor-curated Ayurvedic wellness, natural beauty care, and daily health supplements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/shop" 
              className="bg-brand-green text-white px-8 py-4 rounded-full font-medium hover:bg-brand-green/90 transition-all hover:shadow-lg hover:shadow-brand-green/20 flex items-center justify-center gap-2"
            >
              Shop Collection <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/categories" 
              className="bg-white text-brand-blue border border-brand-blue/10 px-8 py-4 rounded-full font-medium hover:bg-brand-light transition-all flex items-center justify-center"
            >
              Explore Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-y border-brand-gray/10 bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center text-brand-green">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-brand-blue">Natural & Safe</h3>
                <p className="text-xs text-brand-gray mt-1">100% pure ingredients</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center text-brand-green">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-brand-blue">Trusted Quality</h3>
                <p className="text-xs text-brand-gray mt-1">Lab tested & certified</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center text-brand-green">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-brand-blue">Premium Curated</h3>
                <p className="text-xs text-brand-gray mt-1">Doctor recommended</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center text-brand-green">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-brand-blue">Fast Delivery</h3>
                <p className="text-xs text-brand-gray mt-1">Reliable & secure</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Category */}
      <section className="py-20 bg-brand-light/30">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-blue mb-3">Shop by Category</h2>
              <p className="text-brand-gray">Discover our curated range of wellness solutions.</p>
            </div>
            <Link href="/categories" className="hidden sm:flex items-center gap-2 text-brand-green font-medium hover:text-brand-green/80 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category 1 */}
            <Link href="/categories/beauty-care" className="group relative h-80 rounded-2xl overflow-hidden bg-brand-light flex flex-col justify-end p-8 border border-brand-gray/10 hover:shadow-xl hover:shadow-brand-green/10 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/80 to-transparent z-10" />
              <div className="absolute inset-0 flex items-center justify-center text-brand-gray/20">
                <span className="font-heading text-2xl uppercase tracking-widest">Image Placeholder</span>
              </div>
              <div className="relative z-20">
                <h3 className="font-heading text-2xl font-bold text-white mb-2">Natural Beauty</h3>
                <p className="text-white/80 text-sm flex items-center gap-2">
                  Explore products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </p>
              </div>
            </Link>
            
            {/* Category 2 */}
            <Link href="/categories/energy-wellness" className="group relative h-80 rounded-2xl overflow-hidden bg-brand-light flex flex-col justify-end p-8 border border-brand-gray/10 hover:shadow-xl hover:shadow-brand-green/10 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/80 to-transparent z-10" />
              <div className="absolute inset-0 flex items-center justify-center text-brand-gray/20">
                <span className="font-heading text-2xl uppercase tracking-widest">Image Placeholder</span>
              </div>
              <div className="relative z-20">
                <h3 className="font-heading text-2xl font-bold text-white mb-2">Energy & Wellness</h3>
                <p className="text-white/80 text-sm flex items-center gap-2">
                  Explore products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </p>
              </div>
            </Link>
            
            {/* Category 3 */}
            <Link href="/categories/pain-relief" className="group relative h-80 rounded-2xl overflow-hidden bg-brand-light flex flex-col justify-end p-8 border border-brand-gray/10 hover:shadow-xl hover:shadow-brand-green/10 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/80 to-transparent z-10" />
              <div className="absolute inset-0 flex items-center justify-center text-brand-gray/20">
                <span className="font-heading text-2xl uppercase tracking-widest">Image Placeholder</span>
              </div>
              <div className="relative z-20">
                <h3 className="font-heading text-2xl font-bold text-white mb-2">Pain Relief</h3>
                <p className="text-white/80 text-sm flex items-center gap-2">
                  Explore products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-blue mb-3">Featured Essentials</h2>
              <p className="text-brand-gray">Top-rated products trusted by our customers.</p>
            </div>
            <Link href="/shop" className="hidden sm:flex items-center gap-2 text-brand-green font-medium hover:text-brand-green/80 transition-colors">
              Shop All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCard 
              id="cellogen-1000"
              name="Cellogen Premium Antioxidant Herbal Juice"
              brand="Vedique Nutrition"
              price={3449}
              badge="Bestseller"
            />
            <ProductCard 
              id="shilajit-resin-20g"
              name="Himalayan Shilajit Pure Resin (75% Fulvic Acid)"
              brand="URMLIFE"
              price={1499}
              originalPrice={1999}
              badge="Pure Authentic"
            />
            <ProductCard 
              id="luxe-hair-oil-100ml"
              name="L'Aveira Luxe Hair Herbal Oil"
              brand="L'Aveira"
              price={780}
            />
            <ProductCard 
              id="orthocare-kit"
              name="Sandhiveda Orthocare Oil"
              brand="Satvam Wellness"
              price={349}
              badge="Doctor Curated"
            />
          </div>
        </div>
      </section>

      {/* Brand Showcase */}
      <section className="py-20 bg-brand-blue text-brand-light relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="text-brand-gold font-semibold tracking-wider uppercase text-sm mb-4 block">
            The SK Holdings Family
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-16">
            Discover Our Premium Brands
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center">
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <span className="font-heading text-2xl font-bold text-white">VN</span>
              </div>
              <h3 className="font-heading text-lg font-semibold text-white group-hover:text-brand-gold transition-colors">Vedique Nutrition</h3>
              <p className="text-xs text-brand-light/60">Internal Wellness & Immunity</p>
            </div>
            
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <span className="font-heading text-2xl font-bold text-white">SW</span>
              </div>
              <h3 className="font-heading text-lg font-semibold text-white group-hover:text-brand-gold transition-colors">Satvam Wellness</h3>
              <p className="text-xs text-brand-light/60">Joint Care & Pain Relief</p>
            </div>
            
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <span className="font-heading text-2xl font-bold text-white">L&apos;A</span>
              </div>
              <h3 className="font-heading text-lg font-semibold text-white group-hover:text-brand-gold transition-colors">L&apos;Aveira</h3>
              <p className="text-xs text-brand-light/60">Natural Beauty & Hair Care</p>
            </div>
            
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <span className="font-heading text-2xl font-bold text-white">UL</span>
              </div>
              <h3 className="font-heading text-lg font-semibold text-white group-hover:text-brand-gold transition-colors">URMLIFE</h3>
              <p className="text-xs text-brand-light/60">Strength & Vitality</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
