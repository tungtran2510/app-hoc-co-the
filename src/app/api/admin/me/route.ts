import { NextRequest, NextResponse } from 'next/server';
import { checkIsAdminRequest } from '../../../../lib/authServer';

export async function GET(req: NextRequest) {
  const isAdmin = checkIsAdminRequest(req);
  return NextResponse.json({ isAdmin });
}
