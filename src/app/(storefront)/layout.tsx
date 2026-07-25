import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full relative">
        {children}
      </main>
      <Footer />
    </div>
  );
}
