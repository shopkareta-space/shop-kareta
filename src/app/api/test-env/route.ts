import { NextResponse } from "next/server";

export async function GET() {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";
  
  return NextResponse.json({
    hasAnonKey: !!anonKey,
    hasServiceKey: !!serviceKey,
    areKeysIdentical: anonKey === serviceKey,
    serviceKeyLength: serviceKey.length,
    serviceKeyStarts: serviceKey.substring(0, 5),
    serviceKeyEnds: serviceKey.substring(serviceKey.length - 5),
    envKeys: Object.keys(process.env).filter(k => k.includes('SUPABASE'))
  });
}
