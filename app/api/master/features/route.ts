import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

interface Feature {
  id: string
  name: string
  description: string
  slug: string
  is_active: boolean
  icon: string
  priority: string
  enabled_schools: number[]
}

const featuresMock: Feature[] = [
  {
    id: '1',
    name: 'دفع إلكتروني',
    description: 'بوابة دفع متكاملة تدعم العملات المتعددة',
    slug: 'e-payment',
    is_active: true,
    icon: 'Zap',
    priority: 'عالية',
    enabled_schools: [1, 2, 3],
  },
  {
    id: '2',
    name: 'نظام صلاحيات',
    description: 'إدارة صلاحيات المستخدمين والأدوار',
    slug: 'permissions',
    is_active: true,
    icon: 'Shield',
    priority: 'عالية',
    enabled_schools: [1, 2, 3, 4, 5],
  },
  {
    id: '3',
    name: 'تقارير متقدمة',
    description: 'لوحات تحليل وتقارير مخصصة',
    slug: 'advanced-reports',
    is_active: false,
    icon: 'BarChart3',
    priority: 'متوسطة',
    enabled_schools: [],
  },
  {
    id: '4',
    name: 'دعم متعدد اللغات',
    description: 'واجهة كاملة بالعربية والإنجليزية',
    slug: 'multi-lang',
    is_active: true,
    icon: 'Globe',
    priority: 'متوسطة',
    enabled_schools: [1, 2, 4],
  },
  {
    id: '5',
    name: 'أمان متقدم',
    description: 'تشفير البيانات والمصادقة الثنائية',
    slug: 'advanced-security',
    is_active: true,
    icon: 'Lock',
    priority: 'عالية',
    enabled_schools: [1, 2, 3, 5],
  },
  {
    id: '6',
    name: 'تطبيق جوّال',
    description: 'تطبيق iOS و Android',
    slug: 'mobile-app',
    is_active: false,
    icon: 'Smartphone',
    priority: 'منخفضة',
    enabled_schools: [],
  },
]

const mockSchools = [
  { id: 1, name: 'مدرسة الفاروق' },
  { id: 2, name: 'مدرسة النور' },
  { id: 3, name: 'مدرسة الأندلس' },
  { id: 4, name: 'مدرسة القدس' },
  { id: 5, name: 'مدرسة الفلاح' },
]

const toggleSchema = z.object({
  id: z.string(),
  is_active: z.boolean(),
})

const schoolSelectSchema = z.object({
  id: z.string(),
  school_ids: z.array(z.number()),
})

export async function GET() {
  return NextResponse.json({
    data: featuresMock,
    schools: mockSchools,
  })
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = toggleSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const feature = featuresMock.find((f) => f.id === parsed.data.id)
    if (!feature) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 })
    }

    feature.is_active = parsed.data.is_active

    return NextResponse.json({ data: feature })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = schoolSelectSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const feature = featuresMock.find((f) => f.id === parsed.data.id)
    if (!feature) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 })
    }

    feature.enabled_schools = parsed.data.school_ids

    return NextResponse.json({ data: feature })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}