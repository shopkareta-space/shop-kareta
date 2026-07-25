"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-brand-light flex flex-col md:flex-row">
      {/* Left side - Branding & Imagery */}
      <div className="hidden md:flex w-full md:w-5/12 lg:w-1/2 bg-[#0F6B46] relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />
        <div className="absolute -top-64 -left-64 w-[800px] h-[800px] bg-[#148356] rounded-full blur-3xl opacity-50 z-0 pointer-events-none" />
        
        <div className="relative z-10">
          <Link href="/" className="inline-block">
            <span className="font-heading font-bold text-3xl text-white flex items-center gap-2">
              Shop Kareta
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Smart Shopping,<br />Better Living.
          </h1>
          <p className="text-[#A2E2C3] text-lg leading-relaxed mb-8">
            Join the community and experience premium wellness, curated exclusively for you.
          </p>
          
          <div className="flex items-center gap-3 text-white/90 bg-white/10 w-max px-4 py-2.5 rounded-full border border-white/20 backdrop-blur-sm">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-sm font-medium tracking-wide">Secure & Encrypted</span>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 bg-white relative">
        <div className="absolute top-6 left-6 md:hidden">
          <Link href="/" className="text-brand-gray hover:text-brand-blue flex items-center gap-2 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to store
          </Link>
        </div>

        <div className="absolute top-8 right-8 hidden md:block">
          <Link href="/" className="text-brand-gray/60 hover:text-brand-blue flex items-center gap-2 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to store
          </Link>
        </div>

        <BlurFade delay={0.1} className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <h2 className="font-heading text-3xl font-bold text-[#0D1B2A] mb-2">{title}</h2>
            <p className="text-brand-gray text-base">{description}</p>
          </div>
          
          {children}
        </BlurFade>
      </div>
    </div>
  );
}
