import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { ToastProvider } from "@/components/Toast";
import { AuthProvider } from "@/hooks/useAuth";
import { getNavItems } from "@/lib/data";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HSK — تعلَّم الصينية بالعربية",
    template: "%s · HSK",
  },
  description:
    "تعلَّم كلمات HSK بأسلوب يناسب يومك المزدحم — نطق صوتي، مراجعة ذكية، وإنجازات تحفّزك.",
  keywords: [
    "HSK",
    "تعلم الصينية",
    "اللغة الصينية",
    "Chinese learning",
    "مفردات HSK",
    "تعلم الصينية بالعربية",
    "Spaced Repetition",
  ],
  authors: [{ name: "HSK App" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "HSK",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  openGraph: {
    type: "website",
    locale: "ar",
    title: "HSK — تعلَّم الصينية بالعربية",
    description:
      "تعلَّم كلمات HSK بأسلوب يناسب يومك المزدحم — نطق صوتي ومراجعة ذكية.",
    siteName: "HSK",
  },
  twitter: {
    card: "summary",
    title: "HSK — تعلَّم الصينية بالعربية",
    description:
      "تعلَّم كلمات HSK بأسلوب يناسب يومك المزدحم.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  // نسمح بالتكبير حتى 5x — مهم للـaccessibility (WCAG 1.4.4)
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = getNavItems();
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-white">
        <AuthProvider>
          <ToastProvider>
            {children}
            <BottomNav items={navItems} />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
