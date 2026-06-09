"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { User, Session, AuthError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

/**
 * نتيجة موحّدة لعمليات المصادقة — نعيد خطأً نصياً بدل رمي استثناء،
 * ليسهل على واجهة الاستخدام عرض الرسالة دون try/catch.
 */
type AuthResult = { error: string | null };

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean; // true أثناء جلب الجلسة الأولى
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * يترجم أخطاء Supabase إلى رسائل عربية واضحة للمستخدم.
 * نتجنّب كشف تفاصيل تقنية، ونوحّد الصياغة.
 */
function toArabicError(error: AuthError | null): string | null {
  if (!error) return null;
  const msg = error.message.toLowerCase();

  if (msg.includes("invalid login credentials"))
    return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
  if (msg.includes("email not confirmed"))
    return "لم يتم تأكيد بريدك بعد. تحقّق من رسالة التأكيد في بريدك.";
  if (msg.includes("user already registered") || msg.includes("already been registered"))
    return "هذا البريد مسجّل مسبقاً. جرّب تسجيل الدخول.";
  if (msg.includes("password should be at least"))
    return "كلمة المرور قصيرة جداً (٦ أحرف على الأقل).";
  if (msg.includes("unable to validate email") || msg.includes("invalid email"))
    return "صيغة البريد الإلكتروني غير صحيحة.";
  if (msg.includes("rate limit") || msg.includes("too many"))
    return "محاولات كثيرة. انتظر قليلاً ثم حاول مجدداً.";
  if (msg.includes("network"))
    return "تعذّر الاتصال. تحقّق من الإنترنت وحاول مجدداً.";

  // احتياط: رسالة عامة بدل كشف الخطأ التقني
  return "حدث خطأ غير متوقّع. حاول مرة أخرى.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // ننشئ العميل مرة واحدة فقط (useMemo) لتفادي إعادة الإنشاء كل render
  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // 1) الجلسة الأولى عند تحميل التطبيق
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // 2) الاستماع لتغيّرات المصادقة (دخول/خروج/تجديد رمز)
    //    اشتراك واحد فقط لكل التطبيق (لأن الـ hook داخل Context)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!active) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // ── تسجيل الدخول ──────────────────────────────────────────
  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      return { error: toArabicError(error) };
    },
    [supabase]
  );

  // ── إنشاء حساب ────────────────────────────────────────────
  const signUp = useCallback(
    async (
      email: string,
      password: string,
      fullName?: string
    ): Promise<AuthResult> => {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          // full_name يُلتقط في trigger handle_new_user لإنشاء الـ profile
          data: fullName ? { full_name: fullName.trim() } : undefined,
          // وجهة رابط التأكيد في البريد
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/auth/callback`
              : undefined,
        },
      });
      return { error: toArabicError(error) };
    },
    [supabase]
  );

  // ── تسجيل الخروج ──────────────────────────────────────────
  const signOut = useCallback(async (): Promise<AuthResult> => {
    const { error } = await supabase.auth.signOut();
    return { error: toArabicError(error) };
  }, [supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, session, loading, signIn, signUp, signOut }),
    [user, session, loading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook الوصول للمصادقة. يجب استخدامه داخل <AuthProvider>.
 *
 * مثال:
 *   const { user, loading, signIn } = useAuth();
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth يجب أن يُستخدم داخل <AuthProvider>");
  }
  return ctx;
}
