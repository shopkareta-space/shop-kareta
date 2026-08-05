"use client";

import { useState } from "react";
import { Copy, Check, Phone, Shield, Lightbulb, TrendingUp } from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";

export default function InvestorClient() {
  const [copied, setCopied] = useState(false);

  const investor = {
    name: "Seema Jitendra Shahu",
    phone: "9834865215",
    message: "At Shop Kareta, we believe that innovation, integrity, and customer satisfaction form the foundation of lasting success. Supporting a vision that promotes wellness, quality, and trust is both an honor and a responsibility. I am confident that Shop Kareta will continue to inspire healthier lifestyles while building meaningful relationships with customers, partners, and the community. Together, we are creating a brand driven by excellence, transparency, and long-term value."
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(investor.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const visionCards = [
    {
      icon: Shield,
      title: "Trust",
      desc: "Building long-term relationships through honesty and transparency."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      desc: "Creating modern wellness solutions powered by technology."
    },
    {
      icon: TrendingUp,
      title: "Sustainable Growth",
      desc: "Expanding responsibly while delivering value to customers and partners."
    }
  ];

  return (
    <div className="space-y-16">
      
      {/* Profile & Message Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        
        {/* Contact Card */}
        <div className="lg:col-span-1">
          <BlurFade delay={0.2} className="h-full">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 flex flex-col items-center text-center h-full transform transition-all duration-300 hover:shadow-2xl">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#0D1B2A] to-brand-green flex items-center justify-center overflow-hidden shadow-inner mb-6 relative group">
                <span className="text-white text-5xl font-bold font-heading z-10 transition-transform group-hover:scale-110">
                  {investor.name.charAt(0)}
                </span>
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay z-0" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 font-heading">{investor.name}</h2>
              <p className="text-sm font-bold text-brand-gold uppercase tracking-[0.2em] mt-2 mb-8">Strategic Investor</p>
              
              <div className="w-full mt-auto pt-6 border-t border-gray-100 flex flex-col gap-4">
                <p className="text-sm text-gray-500 font-medium">Contact Details</p>
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-3 text-gray-900">
                    <Phone className="w-5 h-5 text-brand-green" />
                    <span className="font-semibold text-lg">{investor.phone}</span>
                  </div>
                  <button 
                    onClick={handleCopyPhone}
                    className="p-2.5 bg-white shadow-sm hover:shadow rounded-xl text-gray-500 hover:text-[#0D1B2A] transition-all active:scale-95"
                    title="Copy Phone Number"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>

        {/* Message Card */}
        <div className="lg:col-span-2">
          <BlurFade delay={0.3} className="h-full">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden h-full flex flex-col relative">

              <div className="p-8 md:p-12 flex-1 flex flex-col justify-center relative z-10">
                <h3 className="font-heading font-bold text-2xl text-[#0D1B2A] mb-8 flex items-center gap-3">
                  <span className="w-10 h-1 bg-brand-gold rounded-full" />
                  A Message from Our Investor
                </h3>
                
                <blockquote className="text-lg md:text-xl lg:text-2xl text-gray-600 font-light leading-[1.8] italic">
                  {investor.message}
                </blockquote>
                
                <div className="mt-10 pt-8 border-t border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-1 bg-brand-green rounded-full" />
                  <p className="font-bold text-xl text-gray-900 font-heading">{investor.name}</p>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
        
      </div>

      {/* Vision Section */}
      <div className="py-12 max-w-6xl mx-auto">
        <BlurFade delay={0.4}>
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#0D1B2A] mb-4">Our Shared Vision</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Guided by strong principles to deliver excellence in every aspect of our business.</p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {visionCards.map((card, idx) => (
            <BlurFade key={card.title} delay={0.5 + (idx * 0.1)}>
              <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-200/30 border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-6">
                  <card.icon className="w-7 h-7 text-brand-green" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-heading">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed">{card.desc}</p>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>

    </div>
  );
}
