import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sectorsMock, sectorFullData } from '@/lib/sectors-mock-data'
import { defaultSectorData } from '@/lib/sector-types'

const createSectorSchema = z.object({
  name: z.string().min(1, 'اسم القطاع مطلوب'),
  slug: z.string().min(1, 'الكود مطلوب').regex(/^[a-z][a-z0-9-]*$/, 'slug must start with a lowercase letter and contain only lowercase letters, numbers, and hyphens'),
  icon: z.string().optional().default('FolderKanban'),
})

export async function GET() {
  return NextResponse.json({ data: sectorsMock })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createSectorSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const id = `${parsed.data.slug}-${Date.now()}`
    const newSector = {
      id,
      name: parsed.data.name,
      slug: parsed.data.slug,
      icon: parsed.data.icon,
      is_active: true,
      created_at: new Date().toISOString(),
    }

    sectorsMock.push(newSector)
    sectorFullData[id] = { ...defaultSectorData }

    return NextResponse.json({ data: newSector }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
