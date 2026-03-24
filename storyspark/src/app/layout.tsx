import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "StorySpark — AI Picture Book Generator",
  description: "Create illustrated picture books with AI",
  manifest: "/manifest.json",
  themeColor: "#F59E0B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="font-body antialiased bg-cream text-navy min-h-screen">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
