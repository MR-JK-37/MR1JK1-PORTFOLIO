import type { Metadata } from "next";
import { Chakra_Petch, Inter, JetBrains_Mono, Dancing_Script } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/shared/LenisProvider";

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "700"],
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-accent",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Jaikiran E — MR!JK! | Cyber Security Portfolio",
  description:
    "Cyber Security undergraduate, CTF competitor & bug hunter. Explore projects in AI-powered malware detection, Android automation, and fraud detection. Portfolio of MR!JK! — Jaikiran E.",
  keywords: [
    "cyber security",
    "CTF",
    "bug bounty",
    "portfolio",
    "Jaikiran",
    "MR!JK!",
    "penetration testing",
    "malware analysis",
  ],
  openGraph: {
    type: "website",
    title: "Jaikiran E — MR!JK! | Cyber Security Portfolio",
    description:
      "Cyber Security undergraduate, CTF competitor & bug hunter. Explore projects in AI-powered malware detection, Android automation, and fraud detection.",
    siteName: "MR!JK! Portfolio",
    locale: "en_IN",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${chakraPetch.variable} ${inter.variable} ${jetbrainsMono.variable} ${dancingScript.variable}`}
    >
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
