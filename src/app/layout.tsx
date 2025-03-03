import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-cyber",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Milestone dApp",
  description: "A Web3 dApp for milestone tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${orbitron.variable} font-cyber bg-cyber-gradient min-h-screen px-4 md:px-8 lg:px-12`}
      >
        <div className="max-w-[1920px] mx-auto">{children}</div>
      </body>
    </html>
  );
}
