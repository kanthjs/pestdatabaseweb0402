import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google"; // Import IBM Plex Sans Thai
import "./globals.css";

const ibm_plex_sans_thai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-ibm-plex-sans-thai",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Thai Rice Pest Monitoring Network | RicePestNet",
  description: "Safeguarding Rice Harvests Together - เครือข่ายเฝ้าระวังศัตรูพืชข้าวแห่งประเทศไทย",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/logo.png" },
    ],
  },
  openGraph: {
    title: "Thai Rice Pest Monitoring Network",
    description: "Safeguarding Rice Harvests Together",
    images: ["/logo.png"],
  },
};

import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";

import QueryProvider from "@/components/providers/QueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      </head>
      <body
        className={`${ibm_plex_sans_thai.variable} antialiased`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
