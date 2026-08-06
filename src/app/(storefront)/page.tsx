import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf, ShieldCheck, Sparkles, Truck, CheckCircle, Star } from "lucide-react";
import ProductCard from "@/components/storefront/ProductCard";
import BlurFade from "@/components/ui/blur-fade";

import { getFeaturedProducts, getRandomProducts } from "@/lib/services/product.service";
import { CategoryShowcase } from "@/components/storefront/CategoryShowcase";

export const revalidate = 7200; // Revalidate every 2 hours (shuffles random products)

export default async function Homepage() {
  const top4Products = await getFeaturedProducts(4);
  const randomProducts = await getRandomProducts(4);

  return (
    <div className="flex flex-col bg-brand-light">
      
      {/* 1. Premium Wellness Hero */}
      <section className="relative overflow-hidden bg-[#0D1B2A] min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-brand-green/5 -z-10 pattern-dots opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B2A] via-[#0D1B2A]/90 to-transparent z-0" />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            {/* Left Content */}
            <div className="w-full lg:w-[45%] text-left">
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
              

            </div>
            
            {/* Right Promotional Banner */}
            <div className="w-full lg:w-[55%] relative mt-12 lg:mt-0 flex justify-center lg:justify-end">
              <BlurFade delay={0.4} yOffset={20} className="w-full max-w-[800px]">
                <div className="w-full rounded-[24px] overflow-hidden shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transform hover:scale-[1.02] transition-all duration-300">
                  <Image 
                    src="/images/promotional-banner.jpg"
                    alt="Nature Heals - Shop Kareta Promotional Banner"
                    width={1600}
                    height={900}
                    className="w-full h-auto object-cover z-0"
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>
              </BlurFade>
            </div>
          </div>
        </div>
      </section>

      {/* 1.5 Shuffled Products (Discover) */}
      <section className="py-16 bg-white border-b border-brand-gray/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-brand-green font-semibold tracking-wider uppercase text-sm mb-2 block">Top Selections</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-blue mb-4">Discover Our Products</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {randomProducts.map((product, index) => (
              <BlurFade key={product.id} delay={0.1 + index * 0.1}>
                <ProductCard 
                  id={product.id}
                  name={product.name}
                  brand={product.brand}
                  category={product.category}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  badge={product.badge}
                  images={product.images}
                />
              </BlurFade>
            ))}
          </div>
          
          <div className="mt-12 flex justify-center">
            <Link href="/shop" className="inline-flex items-center justify-center bg-brand-light text-brand-blue px-8 py-4 rounded-xl font-semibold hover:bg-brand-gray/10 transition-colors border border-brand-gray/20">
              View All Products
            </Link>
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
                <div className="w-48 h-24 relative mb-6 transform group-hover:scale-105 transition-transform duration-300">
                  <Image 
                    src="/images/brands/vedique.jpg"
                    alt="Vedique Nutrition"
                    fill
                    className="object-contain"
                  />
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
                  <div className="w-48 h-24 relative mb-6 mx-auto transform group-hover:scale-105 transition-transform duration-300">
                    <Image 
                      src="/images/brands/satvam.jpg"
                      alt="Satvam Wellness"
                      fill
                      className="object-contain"
                    />
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
                <div className="w-48 h-24 relative mb-6 transform group-hover:scale-105 transition-transform duration-300">
                  <Image 
                    src="/images/brands/laskovia.jpg"
                    alt="La'Skovia"
                    fill
                    className="object-contain"
                  />
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
          
          <CategoryShowcase />
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
            {top4Products.map((product) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                name={product.name}
                brand={product.brand}
                category={product.category}
                price={product.price}
                originalPrice={product.originalPrice}
                badge={product.badge}
                images={product.images}
              />
            ))}
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


    </div>
  );
}
