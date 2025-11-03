import { Jost, Montserrat, Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });
const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });
// const lato = Lato({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });


export const metadata = {
  title: "Cartiq. - Shopping made simple",
  description: "Cartiq. - Shopping made simple",
  icons: {
    icon: "/favicon.png",
  }
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${jost.className} antialiased`}>
          <StoreProvider>
            <Toaster />
            {children}
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
