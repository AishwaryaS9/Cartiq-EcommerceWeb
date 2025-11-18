import { Jost, Montserrat, Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import StoreProvider from "@/app/StoreProvider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });
const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });

export const metadata = {
  title: {
    default: "Cartiq — Shopping Made Simple",
    template: "%s | Cartiq"
  },
  description:
    "Discover Cartiq, your one-stop online marketplace for everything — fashion, gadgets, home, beauty, and more. Shop easily and securely with fast delivery.",
  keywords: [
    "Cartiq",
    "online shopping",
    "ecommerce",
    "fashion",
    "gadgets",
    "beauty",
    "home products",
    "marketplace",
    "deals"
  ],
  metadataBase: new URL("https://cartiq.com"),
  openGraph: {
    title: "Cartiq — Shop Everything You Love",
    description:
      "Cartiq is your destination for all products — from fashion and tech to home essentials. Fast, easy, and secure shopping.",
    url: "https://cartiq.com",
    siteName: "Cartiq",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cartiq Online Store"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png"
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en" className="scroll-smooth">
        <body className={`${jost.className} antialiased text-slate-800 bg-white`}>
          <StoreProvider>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000
              }}
            />
            {children}
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

