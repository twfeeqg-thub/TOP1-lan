'use client'

import { Plus, Trash2, GripVertical } from 'lucide-react'
import type { Project } from '@/lib/sector-types'

interface ProjectsSectionFormProps {
  data: Project[]
  onChange: (data: Project[]) => void
}

export function ProjectsSectionForm({ data, onChange }: ProjectsSectionFormProps) {
  const addProject = () => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: '',
      description: '',
      icon: 'File',
      features: [],
      register_link: '',
      login_link: '',
    }
    onChange([...data, newProject])
  }

  const removeProject = (id: string) => {
    onChange(data.filter((p) => p.id !== id))
  }

  const updateProject = (id: string, field: keyof Project, value: string | string[]) => {
    onChange(data.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const addFeature = (projectId: string) => {
    onChange(
      data.map((p) =>
        p.id === projectId ? { ...p, features: [...p.features, ''] } : p
      )
    )
  }

  const updateFeature = (projectId: string, idx: number, value: string) => {
    onChange(
      data.map((p) =>
        p.id === projectId
          ? { ...p, features: p.features.map((f, i) => (i === idx ? value : f)) }
          : p
      )
    )
  }

  const removeFeature = (projectId: string, idx: number) => {
    onChange(
      data.map((p) =>
        p.id === projectId
          ? { ...p, features: p.features.filter((_, i) => i !== idx) }
          : p
      )
    )
  }

  return (
    <div className="space-y-4">
      {data.map((project, pi) => (
        <div key={project.id} className="glass-card rounded-2xl p-4 space-y-3 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-[var(--text-muted)]" />
              <span className="text-sm font-medium text-[var(--text-main)]">مشروع {pi + 1}</span>
            </div>
            <button
              onClick={() => removeProject(project.id)}
              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1">الاسم</label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1">الأيقونة</label>
              <input
                type="text"
                value={project.icon}
                onChange={(e) => updateProject(project.id, 'icon', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">الوصف</label>
            <textarea
              value={project.description}
              onChange={(e) => updateProject(project.id, 'description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors resize-vertical"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-[var(--text-muted)]">المميزات</label>
              <button
                onClick={() => addFeature(project.id)}
                className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> إضافة ميزة
              </button>
            </div>
            <div className="space-y-2">
              {project.features.map((feature, fi) => (
                <div key={fi} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(project.id, fi, e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                  />
                  <button
                    onClick={() => removeFeature(project.id, fi)}
                    className="p-1 rounded text-rose-400 hover:bg-rose-500/10 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1">رابط التسجيل</label>
              <input
                type="text"
                value={project.register_link}
                onChange={(e) => updateProject(project.id, 'register_link', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1">رابط الدخول</label>
              <input
                type="text"
                value={project.login_link}
                onChange={(e) => updateProject(project.id, 'login_link', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addProject}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-[var(--card-border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all text-sm"
      >
        <Plus className="w-4 h-4" />
        إضافة مشروع جديد
      </button>
    </div>
  )
}
