import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { jwtVerify } from 'jose'

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true'
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-only'

export async function middleware(request: NextRequest) {
  if (DEV_MODE) {
    return NextResponse.next()
  }

  // The login page itself must be reachable without a token, otherwise
  // unauthenticated visitors get stuck in a redirect loop.
  if (request.nextUrl.pathname === '/master/login' || request.nextUrl.pathname === '/login') {
    return NextResponse.next()
  }

  const token = extractToken(request)
  if (!token) {
    return unauthorizedResponse(request)
  }

  const isValid = await verifyToken(token)
  if (!isValid) {
    return unauthorizedResponse(request)
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

/**
 * Yes/No response per surface:
 *  - `/api/client/*` → clean 401 JSON (fetch-friendly, no HTML leak).
 *  - `/client/*`     → redirect to the unified login with the client service
 *                      marker so the user can authenticate and come back.
 *  - everything else (master) → legacy `/master/login` redirect.
 */
function unauthorizedResponse(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (path.startsWith('/api/')) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  if (path.startsWith('/client')) {
    return NextResponse.redirect(new URL('/login?service=client', request.url))
  }

  const loginUrl = new URL('/master/login', request.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    '/master/:path*',
    '/api/master/:path*',
    '/client/:path*',
    '/api/client/:path*',
  ],
}