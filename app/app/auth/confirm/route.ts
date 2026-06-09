import { type NextRequest, NextResponse } from "next/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * معالج تأكيد البريد الإلكتروني (Email Confirmation).
 *
 * يستقبل رابط التأكيد الذي يرسله Supabase في البريد، ويدعم نمطين:
 *  1) PKCE flow:        ?code=...
 *  2) OTP/token_hash:   ?token_hash=...&type=signup|email|recovery|...
 *
 * عند النجاح: يوجّه إلى الوجهة المطلوبة (?next=) أو /dashboard.
 * عند الفشل:  يوجّه إلى /sign-in مع رسالة خطأ عربية في ?error=.
 *
 * يبني عناوين التوجيه من origin الطلب (يعمل محلياً وفي الإنتاج).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // الوجهة بعد النجاح: نقبل ?next= داخلية فقط (حماية من open redirect)
  const nextParam = searchParams.get("next") || "/dashboard";
  const next = nextParam.startsWith("/") ? nextParam : "/dashboard";

  const supabase = await createClient();

  // ── المسار 1: PKCE (code) ──────────────────────────────
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    return redirectWithError(origin, "تعذّر تأكيد الحساب. قد يكون الرابط منتهياً أو مستخدماً من قبل.");
  }

  // ── المسار 2: OTP / token_hash ─────────────────────────
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    return redirectWithError(origin, "تعذّر تأكيد الحساب. قد يكون الرابط منتهياً أو مستخدماً من قبل.");
  }

  // ── لا code ولا token_hash: رابط غير صالح ───────────────
  return redirectWithError(origin, "رابط التأكيد غير صالح أو ناقص.");
}

/** يوجّه إلى /sign-in مع رسالة خطأ مُرمّزة في الـ query */
function redirectWithError(origin: string, message: string) {
  const url = new URL(`${origin}/sign-in`);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url);
}
