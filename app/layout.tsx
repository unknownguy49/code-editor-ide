import type React from "react";
import type { Metadata } from "next";
import Head from "next/head";
import "./globals.css";

export const metadata: Metadata = {
  title: "D-Code - Online Code Editor & Compiler",
  description:
    "A modern, professional online code editor and compiler with multiple themes and language support.",
  generator: "v0.dev",
  icons: {
    icon: "/dcode.png",
    shortcut: "/dcode.png",
    apple: "/dcode.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/dcode.png" type="image/png" />
        <link rel="shortcut icon" href="/dcode.png" type="image/png" />
        <link rel="apple-touch-icon" href="/dcode.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
