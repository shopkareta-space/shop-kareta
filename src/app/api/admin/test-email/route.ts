import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { notificationService } from "@/lib/notifications/email/services/NotificationService";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    // 1. Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { to } = body;
    
    if (!to) {
      return NextResponse.json({ error: "Missing recipient email" }, { status: 400 });
    }

    // 2. Queue test email
    await notificationService.sendTestEmail(to);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Test Email API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
