/**
 * Root Layout - Google Drive Clone
 *
 * This is the root layout component that wraps the entire application.
 * It includes Clerk authentication provider and basic header with sign-in/sign-up functionality.
 */

import "~/styles/globals.css";

import { type Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";

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
          <header className="flex h-16 items-center justify-end gap-4 border-b border-gray-200 p-4">
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
