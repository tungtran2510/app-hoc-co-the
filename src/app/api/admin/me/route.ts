import { NextRequest, NextResponse } from 'next/server';
import { checkIsAdminRequest, getAdminUserFromRequest } from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';

export async function GET(req: NextRequest) {
  const isAdmin = checkIsAdminRequest(req);
  const user = getAdminUserFromRequest(req);
  let supabase_ok = false;

  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('settings').select('workspace_id').limit(1);
      if (!error && data) {
        supabase_ok = true;
      }
    } catch {
      supabase_ok = false;
    }
  }

  return NextResponse.json({ isAdmin, supabase_ok, user });
}

