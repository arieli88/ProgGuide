import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/app-shell";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "תכנות מתקדם ב-C# | פלטפורמת לימוד",
  description: "קורס אינטראקטיבי מלא ב-OOP, ירושה, פולימורפיזם, ממשקים, חריגות, קבצים ו-MySQL",
  openGraph: {
    title: "תכנות מתקדם ב-C#",
    description: "למידה אינטראקטיבית בעברית — מבוסס על חומרי הקורס",
    locale: "he_IL",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning className={`${heebo.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
