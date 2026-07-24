import { NextResponse } from 'next/server'
import { killSwitchMock } from '@/lib/ads-mock-data'

export async function GET() {
  return NextResponse.json({ data: killSwitchMock })
}

export async function POST() {
  killSwitchMock.active = !killSwitchMock.active
  killSwitchMock.toggled_at = new Date().toISOString()
  return NextResponse.json({ data: { ...killSwitchMock } })
}
