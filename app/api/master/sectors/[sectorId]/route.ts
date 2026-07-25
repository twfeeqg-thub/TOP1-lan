import { NextRequest, NextResponse } from 'next/server'
import { sectorsMock, sectorFullData } from '@/lib/sectors-mock-data'
import type { SectorData } from '@/lib/sector-types'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sectorId: string }> }
) {
  const { sectorId } = await params
  const data = sectorFullData[sectorId]
  if (!data) {
    return NextResponse.json({ error: 'Sector not found' }, { status: 404 })
  }
  return NextResponse.json({ data })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sectorId: string }> }
) {
  const { sectorId } = await params
  if (!sectorFullData[sectorId]) {
    return NextResponse.json({ error: 'Sector not found' }, { status: 404 })
  }

  try {
    const body = (await request.json()) as SectorData
    sectorFullData[sectorId] = body

    const summary = sectorsMock.find((s) => s.id === sectorId)
    if (summary) {
      // is_active can optionally be updated via a top-level field
      if (typeof (body as any).is_active === 'boolean') {
        summary.is_active = (body as any).is_active
      }
    }

    return NextResponse.json({ data: sectorFullData[sectorId] })
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ sectorId: string }> }
) {
  const { sectorId } = await params
  if (!sectorFullData[sectorId]) {
    return NextResponse.json({ error: 'Sector not found' }, { status: 404 })
  }

  delete sectorFullData[sectorId]
  const idx = sectorsMock.findIndex((s) => s.id === sectorId)
  if (idx !== -1) sectorsMock.splice(idx, 1)

  return NextResponse.json({ success: true })
}
