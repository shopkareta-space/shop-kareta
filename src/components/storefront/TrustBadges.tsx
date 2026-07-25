import { ShieldCheck, Truck, RefreshCcw, HeartHandshake } from "lucide-react";
import Marquee from "@/components/ui/marquee";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "100% Authentic",
    description: "Doctor curated"
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Secure shipping"
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    description: "Hassle-free policy"
  },
  {
    icon: HeartHandshake,
    title: "Quality Assured",
    description: "Lab tested"
  }
];

export function TrustBadges() {
  return (
    <div className="relative py-6 border-y border-brand-gray/10 overflow-hidden bg-brand-light/20 flex w-full flex-col items-center justify-center">
      <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-brand-light to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-brand-light to-transparent z-10 pointer-events-none" />
      
      <Marquee pauseOnHover className="[--duration:25s] [--gap:2rem] md:[--gap:3rem]">
        {trustItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex flex-col items-center text-center gap-2 group w-[100px] md:w-[140px]">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-brand-gray/5 flex items-center justify-center text-brand-green group-hover:bg-brand-green group-hover:text-white transition-colors duration-300">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-brand-blue mb-0.5 whitespace-nowrap">{item.title}</h4>
                <p className="text-[10px] text-brand-gray whitespace-nowrap">{item.description}</p>
              </div>
            </div>
          );
        })}
      </Marquee>
    </div>
  );
}
