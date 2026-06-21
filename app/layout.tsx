import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, Playfair_Display, Caveat, Space_Mono, Quicksand } from "next/font/google";
import localFont from "next/font/local";
import { QueryProvider } from "@/lib/providers/query-provider";
import { Toaster } from "sonner";
import "./globals.css";

const hemis = localFont({
  src: "../public/fonts/hemis.woff",
  variable: "--font-hemis",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif-display",
});

export const metadata: Metadata = {
  title: "PostMarks",
  description: "Words as memories",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${hemis.variable} ${playfair.variable} ${caveat.variable} ${spaceMono.variable} ${quicksand.variable} ${dmSerifDisplay.variable} ${dmSans.className} h-full w-screen antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
