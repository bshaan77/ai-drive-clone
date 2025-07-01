/**
 * Root Layout - Google Drive Clone
 *
 * This is the root layout component that wraps the entire application.
 * It includes Clerk authentication provider and global components.
 */

import "~/styles/globals.css";

import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "~/components/ui/sonner";
import { ErrorBoundary } from "~/components/error-boundary";

export const metadata: Metadata = {
  title: "Google Drive Clone",
  description:
    "A modern file management application built with Next.js and Clerk",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="antialiased">
          <ErrorBoundary>{children}</ErrorBoundary>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
