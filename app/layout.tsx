import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta"
});

export const metadata: Metadata = {
  title: "Expense Compass",
  description: "Track, visualize, and analyze your personal spending with ease."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.variable}>
      <body className="bg-background text-foreground font-sans">{children}</body>
    </html>
  );
}
