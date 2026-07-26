import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf, ShieldCheck, Sparkles, Truck, CheckCircle, Star } from "lucide-react";
import ProductCard from "@/components/storefront/ProductCard";
import BlurFade from "@/components/ui/blur-fade";
import Marquee from "@/components/ui/marquee";

export default function Homepage() {
  return (
    <div className="flex flex-col bg-brand-light">
      
      {/* 1. Premium Wellness Hero */}
      <section className="relative overflow-hidden bg-[#0D1B2A] min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-brand-green/5 -z-10 pattern-dots opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B2A] via-[#0D1B2A]/90 to-transparent z-0" />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left Content */}
            <div className="flex-1 max-w-2xl text-left">
              <BlurFade delay={0.1}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 text-brand-gold font-semibold tracking-wider uppercase text-sm mb-6 border border-brand-gold/20">
                  <Sparkles className="w-4 h-4" /> SK Holdings Premium
                </span>
              </BlurFade>
              
              <BlurFade delay={0.2}>
                <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1]">
                  Elevate Your Life With <span className="text-brand-green">Nature's Best.</span>
                </h1>
              </BlurFade>
              
              <BlurFade delay={0.3}>
                <p className="text-white/80 text-lg md:text-xl mb-10 leading-relaxed font-light max-w-xl">
                  Discover a curated collection of world-class wellness, nutrition, and natural beauty products—crafted for a healthier, more vibrant you.
                </p>
              </BlurFade>
              
              <BlurFade delay={0.4}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/shop" 
                    className="bg-brand-green text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#148356] transition-all hover:shadow-[0_0_30px_rgba(15,107,70,0.4)] flex items-center justify-center gap-2 text-lg"
                  >
                    Shop Collection <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link 
                    href="/about" 
                    className="bg-white/5 text-white border border-white/10 px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center justify-center text-lg"
                  >
                    Our Story
                  </Link>
                </div>
              </BlurFade>
              
              <BlurFade delay={0.5} className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-[#0D1B2A] bg-brand-light flex items-center justify-center overflow-hidden`}>
                       <img src={`https://api.dicebear.com/7.x/faces/svg?seed=${i}&backgroundColor=e2e8f0`} alt="User" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex text-brand-gold mb-1">
                    {[1,2,3,4,5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-xs text-white/60">Trusted by 10,000+ customers</p>
                </div>
              </BlurFade>
            </div>
            
            {/* Right Product Showcase Placeholder */}
            <div className="flex-1 w-full relative hidden lg:block">
              <BlurFade delay={0.4} className="relative z-10 w-full aspect-square max-w-[600px] ml-auto">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-brand-green/20 to-brand-gold/20 flex items-center justify-center border border-white/10 relative overflow-hidden backdrop-blur-3xl shadow-2xl">
                  {/* Decorative Elements */}
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-brand-green/40 rounded-full blur-3xl" />
                  <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-brand-gold/20 rounded-full blur-3xl" />
                  
                  <div className="text-center z-10">
                    <Leaf className="w-16 h-16 text-white/50 mx-auto mb-4" />
                    <p className="font-heading text-2xl font-bold text-white tracking-widest uppercase opacity-50">Premium Showcase</p>
                  </div>
                </div>
              </BlurFade>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-white border-b border-brand-gray/10 relative z-20 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-brand-blue">Natural & Safe</h3>
                <p className="text-xs text-brand-gray mt-1">100% pure ingredients</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-brand-blue">Trusted Quality</h3>
                <p className="text-xs text-brand-gray mt-1">Lab tested & certified</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-brand-blue">Premium Curated</h3>
                <p className="text-xs text-brand-gray mt-1">Doctor recommended</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green">
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

      {/* 2. Brand Cards Showcase */}
      <section className="py-24 bg-brand-light relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-brand-blue mb-4">Our Premium Brands</h2>
            <p className="text-brand-gray text-lg">Excellence across every dimension of wellness, brought to you by SK Holdings.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand: Vedique Nutrition */}
            <BlurFade delay={0.1}>
              <div className="group bg-white rounded-3xl p-8 border border-brand-gray/10 hover:border-[#0D1B2A]/20 transition-all hover:shadow-xl hover:-translate-y-2 h-full flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl bg-[#0D1B2A] text-white flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform">
                  <span className="font-heading text-3xl font-bold">VN</span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-[#0D1B2A] mb-3">Vedique Nutrition</h3>
                <p className="text-brand-gray leading-relaxed mb-6 flex-1">
                  Advanced nutritional formulas and herbal supplements engineered for holistic immunity and vitality.
                </p>
                <Link href="/shop?brand=vedique" className="text-brand-green font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                  Explore Brand <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </BlurFade>

            {/* Brand: Satvam Wellness */}
            <BlurFade delay={0.2}>
              <div className="group bg-[#0D1B2A] rounded-3xl p-8 border border-[#0D1B2A] transition-all hover:shadow-xl hover:shadow-brand-green/20 hover:-translate-y-2 h-full flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-green/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-24 h-24 rounded-2xl bg-brand-green text-white flex items-center justify-center mb-6 mx-auto transform group-hover:-rotate-6 transition-transform">
                    <span className="font-heading text-3xl font-bold">SW</span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-3">Satvam Wellness</h3>
                  <p className="text-white/70 leading-relaxed mb-6 flex-1">
                    Specialized Ayurvedic formulations targeting joint care, pain relief, and orthopedic longevity.
                  </p>
                  <Link href="/shop?brand=satvam" className="text-brand-green font-semibold flex items-center justify-center gap-2 hover:gap-3 transition-all">
                    Explore Brand <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </BlurFade>

            {/* Brand: La'Skovia */}
            <BlurFade delay={0.3}>
              <div className="group bg-white rounded-3xl p-8 border border-brand-gray/10 hover:border-brand-gold/30 transition-all hover:shadow-xl hover:-translate-y-2 h-full flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform border border-brand-gold/20">
                  <span className="font-heading text-3xl font-bold italic">L'S</span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-[#0D1B2A] mb-3">La'Skovia</h3>
                <p className="text-brand-gray leading-relaxed mb-6 flex-1">
                  Luxury natural beauty and dermatological care, crafted for radiant skin and flawless hair.
                </p>
                <Link href="/shop?brand=laskovia" className="text-brand-gold font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                  Explore Brand <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* 3. Shop By Category */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-brand-green font-semibold tracking-wider uppercase text-sm mb-2 block">Curated Needs</span>
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-brand-blue mb-3">Shop by Category</h2>
              <p className="text-brand-gray text-lg max-w-xl">Find exactly what your body needs with our targeted wellness categories.</p>
            </div>
            <Link href="/categories" className="inline-flex items-center justify-center bg-brand-light text-brand-blue px-6 py-3 rounded-xl font-semibold hover:bg-brand-gray/10 transition-colors shrink-0">
              View All Categories
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/categories/beauty-care" className="group relative h-96 rounded-3xl overflow-hidden bg-brand-light flex flex-col justify-end p-8 transition-all duration-500">
              <div className="absolute inset-0 bg-[#0D1B2A]/40 group-hover:bg-[#0D1B2A]/60 transition-colors z-10" />
              <div className="absolute inset-0 flex items-center justify-center text-white/30 z-0 bg-brand-blue/5">
                <Sparkles className="w-32 h-32 opacity-20" />
              </div>
              <div className="relative z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="bg-white text-[#0D1B2A] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 inline-block">Skin & Hair</span>
                <h3 className="font-heading text-3xl font-bold text-white mb-2">Natural Beauty</h3>
                <p className="text-white/80 flex items-center gap-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  Explore Collection <ArrowRight className="w-4 h-4" />
                </p>
              </div>
            </Link>
            
            <Link href="/categories/energy-wellness" className="group relative h-96 rounded-3xl overflow-hidden bg-brand-light flex flex-col justify-end p-8 transition-all duration-500">
              <div className="absolute inset-0 bg-[#0F6B46]/40 group-hover:bg-[#0F6B46]/60 transition-colors z-10" />
              <div className="absolute inset-0 flex items-center justify-center text-white/30 z-0 bg-brand-green/5">
                <Leaf className="w-32 h-32 opacity-20" />
              </div>
              <div className="relative z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="bg-white text-[#0F6B46] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 inline-block">Immunity</span>
                <h3 className="font-heading text-3xl font-bold text-white mb-2">Energy & Vitality</h3>
                <p className="text-white/80 flex items-center gap-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  Explore Collection <ArrowRight className="w-4 h-4" />
                </p>
              </div>
            </Link>
            
            <Link href="/categories/pain-relief" className="group relative h-96 rounded-3xl overflow-hidden bg-brand-light flex flex-col justify-end p-8 transition-all duration-500 md:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-amber-900/40 group-hover:bg-amber-900/60 transition-colors z-10" />
              <div className="absolute inset-0 flex items-center justify-center text-white/30 z-0 bg-amber-900/5">
                <ShieldCheck className="w-32 h-32 opacity-20" />
              </div>
              <div className="relative z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="bg-white text-amber-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 inline-block">Orthopedic</span>
                <h3 className="font-heading text-3xl font-bold text-white mb-2">Pain Relief</h3>
                <p className="text-white/80 flex items-center gap-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  Explore Collection <ArrowRight className="w-4 h-4" />
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Featured Products (Preserved from original) */}
      <section className="py-24 bg-brand-light relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-brand-blue mb-3">Featured Essentials</h2>
              <p className="text-brand-gray text-lg">Top-rated products trusted by our customers worldwide.</p>
            </div>
            <Link href="/shop" className="inline-flex items-center justify-center bg-[#0D1B2A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1a365d] transition-colors shrink-0">
              View All Products
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

      {/* 5. Company Introduction (SK Holdings) */}
      <section className="py-24 bg-[#0D1B2A] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-green/5 pattern-grid opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <span className="text-brand-gold font-semibold tracking-wider uppercase text-sm">About SK Holdings</span>
              <h2 className="font-heading text-3xl md:text-5xl font-bold leading-tight">
                Pioneering the Future of Natural Wellness.
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                At SK Holdings, our mission is to merge ancient Ayurvedic wisdom with modern scientific precision. We oversee a family of premium brands dedicated to enhancing every aspect of human vitality—from orthopedic care to nutritional excellence and luxurious natural beauty.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div>
                  <h4 className="font-heading text-4xl font-bold text-brand-green mb-2">10+</h4>
                  <p className="text-sm text-white/60 uppercase tracking-wider font-semibold">Years of Trust</p>
                </div>
                <div>
                  <h4 className="font-heading text-4xl font-bold text-brand-green mb-2">50k+</h4>
                  <p className="text-sm text-white/60 uppercase tracking-wider font-semibold">Happy Customers</p>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/about" className="inline-flex items-center gap-2 text-brand-gold font-semibold hover:text-white transition-colors">
                  Learn more about our mission <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div className="flex-1 w-full relative flex items-center justify-center">
              <BlurFade delay={0.4} className="relative group w-fit mx-auto">
                {/* Rotating Halo Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-green/40 via-transparent to-brand-gold/40 rounded-3xl blur-2xl opacity-40 group-hover:opacity-70 animate-[spin_8s_linear_infinite] transition-opacity duration-500 scale-[1.2] -z-10" />
                
                <div className="relative z-10 rounded-3xl bg-[#0D1B2A]/80 backdrop-blur-xl border border-white/10 flex items-center justify-center p-10 sm:p-12 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(15,107,70,0.3)] hover:border-brand-green/30 transition-all duration-500">
                  <Image 
                    src="/logos/sk-holding-logo.svg" 
                    alt="SK Holdings" 
                    width={320} 
                    height={100} 
                    className="w-full max-w-[280px] sm:max-w-sm h-auto opacity-90 group-hover:opacity-100 transition-opacity drop-shadow-md" 
                  />
                </div>
              </BlurFade>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Preview */}
      <section className="py-24 bg-brand-light overflow-hidden">
        <div className="container mx-auto px-4 mb-16 text-center max-w-2xl">
          <span className="text-brand-green font-semibold tracking-wider uppercase text-sm mb-2 block">Customer Stories</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-brand-blue mb-4">Real Results. Real People.</h2>
          <p className="text-brand-gray text-lg">Don't just take our word for it. See what our community has to say about their wellness journey.</p>
        </div>
        
        <div className="relative">
          <Marquee className="[--duration:40s]">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="mx-4 w-[350px] bg-white rounded-3xl p-8 border border-brand-gray/10 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex text-brand-gold mb-6">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <p className="text-brand-blue font-medium text-lg leading-relaxed mb-8">
                    "Since using the Vedique Nutrition line, my energy levels have completely transformed. The quality is unmatched and the results speak for themselves. Highly recommended!"
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-light border border-brand-gray/20 overflow-hidden flex items-center justify-center">
                    <img src={`https://api.dicebear.com/7.x/faces/svg?seed=${i+10}&backgroundColor=e2e8f0`} alt="User" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-blue text-sm">Verified Customer</h4>
                    <p className="text-xs text-brand-gray">Verified Purchase</p>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
          
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-brand-light"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-brand-light"></div>
        </div>
      </section>

    </div>
  );
}
