import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "K–12 Learning App Suite",
  description: "Thinking-development and retention learning platform MVP",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
