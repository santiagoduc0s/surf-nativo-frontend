import type { Metadata, Viewport } from "next";
import { Libre_Franklin } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { AuthProvider } from "@/lib/auth";
import { JsonLd } from "@/components/JsonLd";
import {
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-libre-franklin",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · Tienda de surf en Punta del Este`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
  applicationName: SITE_NAME,
  keywords: [
    "surf",
    "tienda de surf",
    "Punta del Este",
    "Uruguay",
    "wetsuit",
    "neopreno",
    "tabla de surf",
    "bodyboard",
    "Gul",
    "Quiksilver",
    "Rip Curl",
    "Channel Islands",
    "FCS",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "shopping",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_UY",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} · Tienda de surf en Punta del Este`,
    description: SITE_TAGLINE,
    images: [
      {
        url: "/assets/hero-mano-punta.webp",
        width: 1600,
        height: 1200,
        alt: `${SITE_NAME} — La Mano de Punta del Este`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} · Tienda de surf en Punta del Este`,
    description: SITE_TAGLINE,
    images: ["/assets/hero-mano-punta.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2c5468",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-UY" className={libreFranklin.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
