import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dessert & Bakery By Dimo | Sweet Moments, Made with Love",
    template: "%s | Dessert & Bakery By Dimo",
  },
  description:
    "Toko online resmi Dessert & Bakery By Dimo. Menyajikan homemade premium dessert, brownies, cheesecake, pudding buah, pancake durian, pizza, dan salad buah pilihan.",
  keywords: [
    "Dessert & Bakery By Dimo",
    "By Dimo",
    "Dessert Box",
    "Fudgy Brownies",
    "Cheesecake",
    "Pudding Buah",
    "Pancake Durian",
    "Pizza Homemade",
    "Salad Buah Premium",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col bg-brand-cream text-brand-darkBrown">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
