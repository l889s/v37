import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../hooks/useAuth";

// ← أضف هذا الاستيراد إذا عندك ToastProvider
// import { ToastProvider } from "@/components/Toast"; 
// أو حسب المسار اللي عندك

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${ibmPlex.variable} ${notoSans.variable}`}>
      <body>
        <AuthProvider>
          {/* أضف ToastProvider هنا */}
          {/* <ToastProvider> */}
          
          {children}
          
          {/* </ToastProvider> */}
        </AuthProvider>
      </body>
    </html>
  );
}
