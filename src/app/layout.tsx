import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kahani",
  description: "Share your story idea and we'll transform it into an immersive audio experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script>
          (function() {
            window.userbirdq = window.userbirdq || [];
          window.USERBIRD_SITE_ID = 'MFluElDC';
          var script = document.createElement('script');
          script.defer = true;
          script.setAttribute('data-site', window.USERBIRD_SITE_ID);
          script.src = "https://cdn.userbird.com/analytics.min.js";
          var currentScript = document.currentScript || document.getElementsByTagName('script')[0];
          currentScript.parentNode.insertBefore(script, currentScript);
})();
        </script>
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
