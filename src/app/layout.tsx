import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google"; // Updated fonts
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rice Pest Survey Network - Home",
  description: "Safeguarding Rice Harvests Together",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-gray-100 dark:bg-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
