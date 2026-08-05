import InvestorClient from "./InvestorClient";

export default function StorefrontInvestorPage() {
  return (
    <div className="bg-[#F9F9F9] min-h-screen pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0D1B2A] py-24 lg:py-32">
        <div className="absolute inset-0 bg-brand-green/5 -z-10 pattern-dots opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B2A] via-[#0D1B2A]/90 to-transparent z-0" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Meet Our Investor
          </h1>
          <p className="text-white/80 text-lg md:text-xl leading-relaxed font-light">
            The vision behind Shop Kareta is strengthened by the guidance and support of our valued investor.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <InvestorClient />
      </div>

    </div>
  );
}
