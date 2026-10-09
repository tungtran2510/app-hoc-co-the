import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'app_admin_session';
/** Phiên đăng nhập quản trị có hạn dùng (7 ngày) */
export const ADMIN_SESSION_SECONDS = 7 * 24 * 60 * 60;

// Khóa dự phòng ngẫu nhiên theo tiến trình: nếu thiếu cấu hình, phiên cũ sẽ hết hiệu lực khi máy chủ khởi động lại
// (an toàn hơn so với khóa viết cứng trong mã nguồn).
const PROCESS_FALLBACK_SECRET = crypto.randomBytes(32).toString('hex');

function getAdminSecret(): string {
  if (process.env.ADMIN_SECRET) return process.env.ADMIN_SECRET;
  const derived = `${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}|${process.env.ADMIN_PASSWORD || ''}`;
  if (derived.length > 1) return crypto.createHash('sha256').update(derived).digest('hex');
  return PROCESS_FALLBACK_SECRET;
}

export interface AdminSessionUser {
  phone: string;
  name: string;
  role: 'super_admin' | 'admin' | 'instructor';
  allowed_topic_ids?: string[];
}

function sign(exp: string, payloadStr = ''): string {
  const message = payloadStr ? `admin:${exp}:${payloadStr}` : `admin:${exp}`;
  return crypto.createHmac('sha256', getAdminSecret()).update(message).digest('hex');
}

/** Tạo token phiên có chữ ký HMAC: "<hết hạn>.<dữ liệu base64>.<chữ ký>" (hoặc "<hết hạn>.<chữ ký>" cũ) */
export function generateAdminHmac(user?: AdminSessionUser): string {
  const exp = String(Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS);
  if (!user) {
    return `${exp}.${sign(exp)}`;
  }
  const payloadStr = Buffer.from(JSON.stringify(user)).toString('base64url');
  const sig = sign(exp, payloadStr);
  return `${exp}.${payloadStr}.${sig}`;
}

export function parseAdminToken(token?: string | null): { isValid: boolean; user?: AdminSessionUser } {
  if (!token || typeof token !== 'string') return { isValid: false };
  const parts = token.split('.');
  if (parts.length === 2) {
    const [exp, sig] = parts;
    if (!/^\d{9,12}$/.test(exp)) return { isValid: false };
    if (Number(exp) < Math.floor(Date.now() / 1000)) return { isValid: false };
    try {
      const expectedSig = sign(exp);
      const a = Buffer.from(sig);
      const b = Buffer.from(expectedSig);
      if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
        return {
          isValid: true,
          user: { phone: process.env.ADMIN_PHONE || 'admin', name: process.env.ADMIN_NAME || 'Quản trị viên', role: 'super_admin' },
        };
      }
    } catch {
      return { isValid: false };
    }
  } else if (parts.length === 3) {
    const [exp, payloadB64, sig] = parts;
    if (!/^\d{9,12}$/.test(exp)) return { isValid: false };
    if (Number(exp) < Math.floor(Date.now() / 1000)) return { isValid: false };
    try {
      const expectedSig = sign(exp, payloadB64);
      const a = Buffer.from(sig);
      const b = Buffer.from(expectedSig);
      if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
        const decoded = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
        return { isValid: true, user: decoded };
      }
    } catch {
      return { isValid: false };
    }
  }
  return { isValid: false };
}

export function verifyAdminToken(token?: string | null): boolean {
  return parseAdminToken(token).isValid;
}

export function safeEqualStrings(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function getAdminUserFromRequest(request?: NextRequest): AdminSessionUser | null {
  let token: string | undefined;
  if (request) {
    token = request.cookies.get(COOKIE_NAME)?.value || request.headers.get('x-admin-token') || undefined;
  } else {
    try {
      token = cookies().get(COOKIE_NAME)?.value;
    } catch {
      token = undefined;
    }
  }
  const res = parseAdminToken(token);
  return res.isValid && res.user ? res.user : null;
}

export function checkIsAdminRequest(request?: NextRequest): boolean {
  return getAdminUserFromRequest(request) !== null;
}

export function checkIsSuperAdminRequest(request?: NextRequest): boolean {
  const user = getAdminUserFromRequest(request);
  if (!user) return false;
  return user.role === 'super_admin';
}


/** Giới hạn số lần gọi theo khóa (IP...) – bộ nhớ tiến trình, đủ để chặn dò mật khẩu cơ bản */
const rateBuckets = new Map<string, { count: number; reset: number }>();
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const b = rateBuckets.get(key);
  if (!b || b.reset < now) {
    rateBuckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  b.count += 1;
  return b.count <= max;
}

export function getClientIp(req: NextRequest): string {
  return (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
}

export { COOKIE_NAME };

/** Băm mật khẩu bằng scrypt (có muối) để không lưu mật khẩu dạng chữ thường trong CSDL */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

/** Kiểm tra mật khẩu với giá trị đã lưu (hỗ trợ cả bản băm scrypt lẫn mật khẩu cũ dạng chữ thường) */
export function verifyPassword(input: string, stored: string): boolean {
  if (typeof input !== 'string' || !stored) return false;
  if (stored.startsWith('scrypt$')) {
    const [, salt, hash] = stored.split('$');
    if (!salt || !hash) return false;
    try {
      const test = crypto.scryptSync(input, salt, 64);
      const expected = Buffer.from(hash, 'hex');
      return test.length === expected.length && crypto.timingSafeEqual(test, expected);
    } catch {
      return false;
    }
  }
  return safeEqualStrings(input, stored);
}
