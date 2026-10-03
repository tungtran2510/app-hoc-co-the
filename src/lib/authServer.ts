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

function sign(exp: string): string {
  return crypto.createHmac('sha256', getAdminSecret()).update(`admin:${exp}`).digest('hex');
}

/** Tạo token phiên có chữ ký và hạn dùng: "<hết hạn (giây)>.<chữ ký>" */
export function generateAdminHmac(): string {
  const exp = String(Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS);
  return `${exp}.${sign(exp)}`;
}

export function verifyAdminToken(token?: string | null): boolean {
  if (!token || typeof token !== 'string') return false;
  const dot = token.indexOf('.');
  if (dot <= 0) return false;
  const exp = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!/^\d{9,12}$/.test(exp)) return false;
  if (Number(exp) < Math.floor(Date.now() / 1000)) return false;
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(sign(exp));
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function safeEqualStrings(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
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
