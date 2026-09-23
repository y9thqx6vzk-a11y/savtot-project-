import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export const metadata: Metadata = {
  title: "מתכנן פרויקטים מינימליסטי",
  description: "כלי תכנון פרויקטים מתקדם להפחתת עומס קוגניטיבי בהשראת אפל.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className="light">
      <body className="antialiased min-h-screen transition-colors duration-300 bg-white dark:bg-[#09090b] text-zinc-950 dark:text-zinc-50">
        {children}
      </body>
    </html>
  );
}
