import Link from "next/link";
import { ArrowRight, Heart, ShieldCheck, Truck, Star, Sparkles, CheckCircle2, Headphones, Shield, PackageCheck, Award } from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";
import { CategoryShowcase } from "@/components/storefront/CategoryShowcase";

export const metadata = {
  title: "About Shop Kareta | Premium Wellness & Ayurveda",
  description: "Discover the story, mission, and vision behind Shop Kareta – your trusted destination for genuine Ayurvedic and wellness products.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-brand-light">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-[#0D1B2A] py-24 lg:py-32 flex items-center">
        <div className="absolute inset-0 bg-brand-green/5 -z-10 pattern-dots opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0D1B2A] z-0" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <BlurFade delay={0.1}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 text-brand-gold font-semibold tracking-wider uppercase text-sm mb-6 border border-brand-gold/20">
              <Sparkles className="w-4 h-4" /> About Shop Kareta
            </span>
          </BlurFade>
          
          <BlurFade delay={0.2}>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight max-w-4xl mx-auto">
              Rooted in Nature, <br />
              <span className="text-brand-green">Crafted for Your Well-being.</span>
            </h1>
          </BlurFade>
          
          <BlurFade delay={0.3}>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
              We are on a mission to bring authentic, high-quality Ayurvedic and natural wellness solutions to your doorstep, helping you live a healthier, more vibrant life.
            </p>
          </BlurFade>
        </div>
      </section>

      {/* 2. Our Story */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <BlurFade delay={0.2} className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden bg-brand-light border-8 border-white shadow-xl relative z-10">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#0F6B46]/20 to-[#0D1B2A]/20 mix-blend-multiply" />
                  <img 
                    src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2070&auto=format&fit=crop" 
                    alt="Ayurvedic Herbs and Wellness" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Decorative blob behind image */}
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-brand-gold/20 rounded-full blur-3xl -z-10" />
              </BlurFade>
            </div>
            
            <div className="w-full lg:w-1/2 space-y-6">
              <BlurFade delay={0.3}>
                <span className="text-brand-green font-semibold tracking-wider uppercase text-sm mb-2 block">Our Story</span>
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-brand-blue mb-6">A Journey of Trust & Authenticity</h2>
                <div className="space-y-4 text-brand-gray text-lg leading-relaxed">
                  <p>
                    Shop Kareta was born out of a simple yet profound realization: in a market flooded with synthetic supplements and quick fixes, finding genuine, natural wellness products is incredibly difficult.
                  </p>
                  <p>
                    We set out to create a sanctuary of authenticity. We partnered directly with esteemed brands like Vedique Nutrition and Satvam Wellness to ensure that every product we deliver meets the highest standards of purity and efficacy.
                  </p>
                  <p>
                    Today, Shop Kareta is more than an e-commerce platform. It is a commitment to your health, a promise of uncompromising quality, and a trusted partner in your daily wellness journey.
                  </p>
                </div>
              </BlurFade>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Mission */}
      <section className="py-24 bg-brand-light">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-green font-semibold tracking-wider uppercase text-sm mb-2 block">Our Mission</span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-brand-blue mb-4">Empowering Better Living</h2>
            <p className="text-brand-gray text-lg">We are driven by four core principles that shape everything we do.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <BlurFade delay={0.1}>
              <div className="bg-white p-8 rounded-3xl border border-brand-gray/10 hover:shadow-xl hover:-translate-y-2 transition-all h-full text-center">
                <div className="w-16 h-16 mx-auto bg-brand-green/10 text-brand-green rounded-2xl flex items-center justify-center mb-6">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-xl text-brand-blue mb-3">Quality Products</h3>
                <p className="text-brand-gray leading-relaxed">Curating only the finest, lab-tested, and certified natural supplements.</p>
              </div>
            </BlurFade>
            
            <BlurFade delay={0.2}>
              <div className="bg-white p-8 rounded-3xl border border-brand-gray/10 hover:shadow-xl hover:-translate-y-2 transition-all h-full text-center">
                <div className="w-16 h-16 mx-auto bg-brand-blue/10 text-brand-blue rounded-2xl flex items-center justify-center mb-6">
                  <Truck className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-xl text-brand-blue mb-3">Fast Delivery</h3>
                <p className="text-brand-gray leading-relaxed">Ensuring your wellness essentials reach your doorstep swiftly and securely.</p>
              </div>
            </BlurFade>
            
            <BlurFade delay={0.3}>
              <div className="bg-white p-8 rounded-3xl border border-brand-gray/10 hover:shadow-xl hover:-translate-y-2 transition-all h-full text-center">
                <div className="w-16 h-16 mx-auto bg-brand-gold/10 text-brand-gold rounded-2xl flex items-center justify-center mb-6">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-xl text-brand-blue mb-3">Customer First</h3>
                <p className="text-brand-gray leading-relaxed">Prioritizing your health goals and satisfaction above everything else.</p>
              </div>
            </BlurFade>
            
            <BlurFade delay={0.4}>
              <div className="bg-white p-8 rounded-3xl border border-brand-gray/10 hover:shadow-xl hover:-translate-y-2 transition-all h-full text-center">
                <div className="w-16 h-16 mx-auto bg-amber-600/10 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-xl text-brand-blue mb-3">Better Living</h3>
                <p className="text-brand-gray leading-relaxed">Promoting a holistic lifestyle through education and premium nutrition.</p>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* 4. Our Vision */}
      <section className="py-32 bg-[#0D1B2A] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542841791-afe04a62c76a?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-[#0D1B2A]/80" />
        
        <div className="container mx-auto px-4 relative z-10">
          <BlurFade delay={0.2}>
            <span className="text-brand-gold font-semibold tracking-wider uppercase text-sm mb-6 block">Our Vision</span>
            <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl mx-auto leading-tight italic">
              "To become the world's most trusted sanctuary for natural healing, empowering every individual to reclaim their vitality through the wisdom of nature."
            </h2>
          </BlurFade>
        </div>
      </section>

      {/* 5. Why Choose Shop Kareta */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-green font-semibold tracking-wider uppercase text-sm mb-2 block">The Shop Kareta Difference</span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-brand-blue mb-4">Why Choose Us?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
            <div className="flex gap-4">
              <div className="shrink-0 mt-1">
                <CheckCircle2 className="w-8 h-8 text-brand-green" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-brand-blue mb-2">Genuine Products</h3>
                <p className="text-brand-gray leading-relaxed">Sourced directly from certified manufacturers. No middlemen, no counterfeits.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="shrink-0 mt-1">
                <PackageCheck className="w-8 h-8 text-brand-blue" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-brand-blue mb-2">Fast Delivery</h3>
                <p className="text-brand-gray leading-relaxed">Optimized logistics ensuring your wellness items arrive fresh and on time.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="shrink-0 mt-1">
                <Shield className="w-8 h-8 text-brand-gold" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-brand-blue mb-2">Secure Shopping</h3>
                <p className="text-brand-gray leading-relaxed">Bank-grade encryption protecting your personal data and payment details.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="shrink-0 mt-1">
                <Headphones className="w-8 h-8 text-[#0D1B2A]" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-brand-blue mb-2">Dedicated Support</h3>
                <p className="text-brand-gray leading-relaxed">Our friendly wellness experts are always ready to assist you with any queries.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="shrink-0 mt-1">
                <ShieldCheck className="w-8 h-8 text-brand-green" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-brand-blue mb-2">Affordable Prices</h3>
                <p className="text-brand-gray leading-relaxed">Premium wellness shouldn't be a luxury. We offer competitive pricing every day.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="shrink-0 mt-1">
                <Star className="w-8 h-8 text-amber-500" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-brand-blue mb-2">Customer Satisfaction</h3>
                <p className="text-brand-gray leading-relaxed">A hassle-free return policy and commitment to ensuring you are 100% happy.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Our Promise */}
      <section className="bg-brand-green text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <BlurFade delay={0.2}>
            <ShieldCheck className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">The Shop Kareta Promise</h2>
            <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
              We pledge to maintain 100% transparency in our sourcing, absolute authenticity in our product offerings, and unwavering reliability in our service to you. Your trust is our greatest asset.
            </p>
          </BlurFade>
        </div>
      </section>

      {/* 8. Statistics Section */}
      <section className="py-24 bg-white border-b border-brand-gray/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
            <BlurFade delay={0.1}>
              <div className="font-heading text-5xl md:text-6xl font-bold text-brand-blue mb-2">500+</div>
              <p className="text-brand-gray font-medium uppercase tracking-wider text-sm">Curated Products</p>
            </BlurFade>
            <BlurFade delay={0.2}>
              <div className="font-heading text-5xl md:text-6xl font-bold text-brand-green mb-2">15+</div>
              <p className="text-brand-gray font-medium uppercase tracking-wider text-sm">Trusted Brands</p>
            </BlurFade>
            <BlurFade delay={0.3}>
              <div className="font-heading text-5xl md:text-6xl font-bold text-brand-gold mb-2">50k+</div>
              <p className="text-brand-gray font-medium uppercase tracking-wider text-sm">Happy Customers</p>
            </BlurFade>
            <BlurFade delay={0.4}>
              <div className="font-heading text-5xl md:text-6xl font-bold text-[#0D1B2A] mb-2">24/7</div>
              <p className="text-brand-gray font-medium uppercase tracking-wider text-sm">Support Availability</p>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* 7. Product Categories Preview */}
      <section className="py-24 bg-brand-light">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-brand-green font-semibold tracking-wider uppercase text-sm mb-2 block">Explore Offerings</span>
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-brand-blue mb-3">Our Collections</h2>
              <p className="text-brand-gray text-lg max-w-xl">Find exactly what your body needs with our targeted wellness categories.</p>
            </div>
            <Link href="/shop" className="inline-flex items-center justify-center bg-brand-blue text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-blue/90 transition-colors shrink-0">
              View All Products
            </Link>
          </div>
          
          <CategoryShowcase />
        </div>
      </section>

      {/* 9. Call to Action */}
      <section className="py-32 bg-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gold/5 -z-10" />
        <div className="container mx-auto px-4 relative z-10">
          <BlurFade delay={0.2}>
            <h2 className="font-heading text-4xl md:text-6xl font-bold text-brand-blue mb-6">
              Start Your Wellness <br className="hidden md:block" /> Journey Today
            </h2>
            <p className="text-brand-gray text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Join thousands of others who have transformed their lives with our authentic, natural supplements.
            </p>
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-2 bg-brand-green text-white px-10 py-5 rounded-xl font-semibold text-lg hover:bg-[#148356] transition-all hover:shadow-[0_0_30px_rgba(15,107,70,0.4)]"
            >
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>
          </BlurFade>
        </div>
      </section>

    </div>
  );
}
