import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const projectsMock = [
  {
    id: '1',
    name: 'المنصة التعليمية',
    slug: 'edu-platform',
    sector_name: 'التعليم',
    is_active: true,
    modules_config: { version: '2.0', features: ['analytics', 'reports'] },
    created_at: '2026-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'نظام الصحة الإلكتروني',
    slug: 'e-health',
    sector_name: 'الصحة',
    is_active: true,
    modules_config: { version: '1.5', features: ['ehr', 'appointments'] },
    created_at: '2026-03-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'تطبيق العقارات الذكي',
    slug: 'smart-realestate',
    sector_name: 'العقارات',
    is_active: true,
    modules_config: { version: '2.1', features: ['listing', 'vr-tour'] },
    created_at: '2025-11-20T00:00:00Z',
  },
  {
    id: '4',
    name: 'منصة التجارة الإلكترونية',
    slug: 'ecommerce',
    sector_name: 'التجارة',
    is_active: false,
    modules_config: { version: '1.0', features: ['cart', 'payment'] },
    created_at: '2026-07-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'نظام إدارة المستشفيات',
    slug: 'hospital-mgmt',
    sector_name: 'الصحة',
    is_active: true,
    modules_config: { version: '2.0', features: ['inventory', 'staff'] },
    created_at: '2026-02-10T00:00:00Z',
  },
]

const createProjectSchema = z.object({
  name: z.string().min(1, 'اسم المشروع مطلوب'),
  slug: z.string().min(1, 'الكود مطلوب').regex(/^[a-z][a-z0-9-]*$/, 'slug must start with a lowercase letter and contain only lowercase letters, numbers, and hyphens'),
  sector_name: z.string().min(1, 'اسم القطاع مطلوب'),
  modules_config: z.any().optional().default({}),
})

export async function GET() {
  return NextResponse.json({ data: projectsMock })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createProjectSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const newProject = {
      id: String(Date.now()),
      ...parsed.data,
      is_active: true,
      created_at: new Date().toISOString(),
    }

    projectsMock.push(newProject)

    return NextResponse.json({ data: newProject }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}