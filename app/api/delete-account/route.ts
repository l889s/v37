import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// This route requires the Supabase service_role key (server-side only)
// Add SUPABASE_SERVICE_ROLE_KEY to your Vercel environment variables

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "userId مطلوب" }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // NOT the anon key
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      console.error("Supabase admin deleteUser error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("delete-account route error:", err);
    return NextResponse.json({ error: "خطأ داخلي في الخادم" }, { status: 500 });
  }
}
