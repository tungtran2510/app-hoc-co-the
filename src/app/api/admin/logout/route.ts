import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '../../../../lib/authServer';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    maxAge: 0,
    path: '/',
  });
  return response;
}
