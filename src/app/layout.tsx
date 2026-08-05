import type { Metadata } from "next";
import { Poppins, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SessionProvider } from "@/components/auth/SessionProvider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shop Kareta | Smart Shopping, Better Living",
  description: "Premium Ayurvedic & Wellness Ecommerce Platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "scroll-smooth", poppins.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full font-sans bg-background text-foreground">
        <SessionProvider>
            {children}
        </SessionProvider>
      </body>
    </html>
  );
}
