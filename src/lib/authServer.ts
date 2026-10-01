import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'app_admin_session';

function getAdminSecret(): string {
  return process.env.ADMIN_SECRET || 'app-hoc-co-the-secret-salt-key-2026';
}

export function generateAdminHmac(): string {
  const secret = getAdminSecret();
  return crypto.createHmac('sha256', secret).update('admin').digest('hex');
}

export function verifyAdminToken(token?: string | null): boolean {
  if (!token) return false;
  const expected = generateAdminHmac();
  try {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function checkIsAdminRequest(request?: NextRequest): boolean {
  let token: string | undefined;
  if (request) {
    token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      token = request.headers.get('x-admin-token') || undefined;
    }
  } else {
    try {
      token = cookies().get(COOKIE_NAME)?.value;
    } catch {
      token = undefined;
    }
  }
  return verifyAdminToken(token);
}

export { COOKIE_NAME };
