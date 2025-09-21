import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Accelera - Enterprise Solutions",
  description: "AI-powered enterprise solutions and workflow automation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-sans antialiased"
        style={{
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
