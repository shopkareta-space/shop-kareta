import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { notificationService } from "@/lib/notifications/email/services/NotificationService";

/**
 * POST /api/auth/send-otp
 *
 * Architecture:
 * ─────────────────────────────────────────────────────────────────────────────
 * This route has TWO modes depending on whether RESEND_API_KEY is configured:
 *
 * MODE A — Supabase handles email (default, zero config):
 *   Call supabase.auth.signInWithOtp() and Supabase sends the email natively.
 *   The notificationService is NOT called in this mode.
 *
 * MODE B — Custom provider (Resend, SMTP) when RESEND_API_KEY is set:
 *   1. Use Supabase Admin to generate a token
 *   2. Send the email via notificationService (Resend/SMTP)
 *   Supabase still verifies the token — we just control the email.
 *
 * To switch from Mode A to Mode B: add RESEND_API_KEY to your environment.
 * No other code changes are needed.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const supabase = await createClient();
    const useCustomProvider = !!process.env.RESEND_API_KEY;

    if (useCustomProvider) {
      // ── MODE B: Custom Provider ───────────────────────────────────────────
      // Generate a one-time token via Supabase Admin (server-side only)
      const supabaseAdmin = (await import("@supabase/supabase-js")).createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: "signup",
        email,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });

      if (linkError || !linkData.properties?.email_otp) {
        console.error("[send-otp] Admin generateLink error:", linkError);
        return NextResponse.json(
          { error: "Failed to generate verification code." },
          { status: 500 }
        );
      }

      const otp = linkData.properties.email_otp;

      // Send via our notification infrastructure (Resend, SMTP, etc.)
      await notificationService.sendAuthVerification(email, otp, name);

      return NextResponse.json({ success: true, mode: "custom" });
    } else {
      // ── MODE A: Supabase Default Email ────────────────────────────────────
      // Supabase handles email delivery natively — no code changes needed
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // Only for existing unverified users
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, mode: "supabase" });
    }
  } catch (err: any) {
    console.error("[send-otp] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
