import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../hooks/useAuth";

// يمكنك إضافة ToastProvider هنا إذا عندك
// import { ToastProvider } from "@/components/Toast";

const ibmPlex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex",
});

const notoSans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "HSK - تعلم اللغة الصينية",
  description: "تطبيق تعلم اللغة الصينية لاختبار HSK",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${ibmPlex.variable} ${notoSans.variable}`}>
      <body className="bg-[#FAFAF8] text-[#1a1a1a]">
        <AuthProvider>
          {/* هنا تقدر تضيف ToastProvider إذا عندك */}
          {/* <ToastProvider> */}

          {children}

          {/* Bottom Navigation أو أي عناصر ثابتة */}
          {/* <BottomNav /> */}

          {/* </ToastProvider> */}
        </AuthProvider>
      </body>
    </html>
  );
}
