import type { Metadata } from "next";
import "./globals.css";

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
