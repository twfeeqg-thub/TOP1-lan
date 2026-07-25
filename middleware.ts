import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { jwtVerify } from 'jose'

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true'
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-only'

export async function middleware(request: NextRequest) {
  if (DEV_MODE) {
    return NextResponse.next()
  }

  const token = extractToken(request)
  if (!token) {
    return redirectToLogin(request)
  }

  const isValid = await verifyToken(token)
  if (!isValid) {
    return redirectToLogin(request)
  }

  return NextResponse.next()
}

function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }

  const cookieToken = request.cookies.get('aisahl_access_token')
  if (cookieToken?.value) {
    return cookieToken.value
  }

  return null
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/master/login', request.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    '/master/:path*',
    '/api/master/:path*',
  ],
}
