import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Splitt — Predict Anonymously",
  description: "Post confessions, make bold predictions, and vote on outcomes — all without revealing who you are.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#f3f1ff", color: "#1a1730" }}>
        {children}
      </body>
    </html>
  );
}