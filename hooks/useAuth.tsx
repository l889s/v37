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

type AuthResult = { error: string | null };

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toArabicError(error: AuthError | null): string | null {
  if (!error) return null;
  const msg = error.message.toLowerCase();

  if (msg.includes("invalid login credentials"))
    return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
  if (msg.includes("email not confirmed"))
    return "لم يتم تأكيد بريدك بعد. تحقق من رسالة التأكيد في بريدك.";
  if (msg.includes("user already registered") || msg.includes("already been registered"))
    return "هذا البريد مسجّل مسبقاً. جرّب تسجيل الدخول.";
  if (msg.includes("password should be at least"))
    return "كلمة المرور قصيرة جداً (٦ أحرف على الأقل).";
  if (msg.includes("unable to validate email") || msg.includes("invalid email"))
    return "صيغة البريد الإلكتروني غير صحيحة.";
  if (msg.includes("rate limit") || msg.includes("too many"))
    return "محاولات كثيرة. انتظر قليلاً ثم حاول مجدداً.";
  if (msg.includes("network"))
    return "تعذّر الاتصال. تحقق من الإنترنت وحاول مجدداً.";

  return "حدث خطأ غير متوقّع. حاول مرة أخرى.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // جلب الجلسة الأولى
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // الاستماع لتغييرات المصادقة
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
          data: fullName ? { full_name: fullName.trim() } : undefined,
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

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth يجب أن يُستخدم داخل <AuthProvider>");
  }
  return ctx;
}
