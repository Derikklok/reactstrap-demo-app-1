import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/erp/AppShell";

const ui = Manrope({ variable: "--font-ui", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Meridian ERP",
  description: "Enterprise operations suite",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${ui.variable} ${mono.variable}`} data-scroll-behavior="smooth">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}