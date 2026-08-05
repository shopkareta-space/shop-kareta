import Image from "next/image";

export default function StorefrontLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F9F9F9]">
      <div className="relative flex flex-col items-center justify-center">
        {/* Animated outer ring */}
        <div className="absolute inset-0 w-32 h-32 -m-4 border-t-2 border-brand-green rounded-full animate-spin opacity-20"></div>
        
        {/* Logo */}
        <div className="relative w-24 h-24 animate-pulse">
          <Image 
            src="/logos/shop-kareta-logo.svg" 
            alt="Shop Kareta Logo" 
            fill 
            className="object-contain drop-shadow-xl"
            priority
          />
        </div>
      </div>
      
      {/* Loading text */}
      <div className="mt-8 flex items-center gap-2 text-brand-blue/60 font-medium tracking-widest text-sm uppercase">
        <span>Loading</span>
        <span className="flex gap-1">
          <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
        </span>
      </div>
    </div>
  );
}
