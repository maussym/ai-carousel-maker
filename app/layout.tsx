import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carousel — Turn any text into a beautiful carousel",
  description:
    "Paste your article, blog post, or thread. Get post-ready slides for LinkedIn and Instagram in 30 seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${GeistSans.className} bg-[#050505] text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
