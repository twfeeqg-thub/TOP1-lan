'use client'

import { useState, useCallback } from 'react'
import { motion } from 'motion/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  BarChart3, MousePointerClick, Eye, DollarSign, Plus, Loader2,
  Check, X, AlertTriangle, Skull, Megaphone, Clock, User,
} from 'lucide-react'
import { GlassModal } from '@/components/ui/glass-modal'
import { ToggleSwitch } from '@/components/ui/toggle-switch'
import { cn } from '@/lib/utils'
import { ClientAdRequestModal } from '@/components/ads/client-ad-request-modal'
import { MasterAdModal, type AdFormData } from '@/components/ads/master-ad-modal'
import type { Ad, AdRequest, KillSwitchState } from '@/lib/ad-types'

async function fetchRequests(): Promise<{ data: AdRequest[] }> {
  const res = await fetch('/api/master/ads/requests')
  if (!res.ok) throw new Error('Failed to fetch requests')
  return res.json()
}

async function fetchAds(): Promise<{ data: Ad[] }> {
  const res = await fetch('/api/master/ads')
  if (!res.ok) throw new Error('Failed to fetch ads')
  return res.json()
}

async function fetchKillSwitch(): Promise<{ data: KillSwitchState }> {
  const res = await fetch('/api/master/ads/kill-switch')
  if (!res.ok) throw new Error('Failed to fetch kill switch')
  return res.json()
}

async function updateRequest(id: string, status: 'approved' | 'rejected') {
  const res = await fetch('/api/master/ads/requests', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status }),
  })
  if (!res.ok) throw new Error('Failed to update request')
  return res.json()
}

async function createAd(data: AdFormData) {
  const res = await fetch('/api/master/ads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ad_config: {
        title: data.title,
        description: data.description,
        targetUrl: data.targetUrl,
        placement: data.placement,
        display_space: data.display_space,
        lang: data.lang,
        is_exclusive: data.is_exclusive,
        is_fixed: data.is_fixed,
        cta_type: data.cta_type,
      },
      media_url: data.media_url || undefined,
      status: data.status,
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to create ad')
  }
  return res.json()
}

async function updateAd(data: AdFormData & { id: string }) {
  const res = await fetch('/api/master/ads', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: data.id,
      ad_config: {
        title: data.title,
        description: data.description,
        targetUrl: data.targetUrl,
        placement: data.placement,
        display_space: data.display_space,
        lang: data.lang,
        is_exclusive: data.is_exclusive,
        is_fixed: data.is_fixed,
        cta_type: data.cta_type,
      },
      media_url: data.media_url || undefined,
      status: data.status,
    }),
  })
  if (!res.ok) throw new Error('Failed to update ad')
  return res.json()
}

async function toggleKillSwitch() {
  const res = await fetch('/api/master/ads/kill-switch', { method: 'POST' })
  if (!res.ok) throw new Error('Failed to toggle kill switch')
  return res.json()
}

export default function AdsPage() {
  const [clientModalOpen, setClientModalOpen] = useState(false)
  const [masterModalOpen, setMasterModalOpen] = useState(false)
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [approvingRequest, setApprovingRequest] = useState<AdRequest | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{ id: string; type: 'approved' | 'rejected' } | null>(null)

  const queryClient = useQueryClient()

  const { data: requestsData, isLoading: requestsLoading } = useQuery({
    queryKey: ['master-ad-requests'],
    queryFn: fetchRequests,
  })

  const { data: adsData, isLoading: adsLoading } = useQuery({
    queryKey: ['master-ads'],
    queryFn: fetchAds,
  })

  const { data: ksData } = useQuery({
    queryKey: ['master-kill-switch'],
    queryFn: fetchKillSwitch,
  })

  const requests = requestsData?.data ?? []
  const ads = adsData?.data ?? []
  const killSwitch = ksData?.data

  const requestMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' }) =>
      updateRequest(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-ad-requests'] })
      queryClient.invalidateQueries({ queryKey: ['master-ads'] })
      setConfirmDialog(null)
    },
  })

  const adMutation = useMutation({
    mutationFn: (data: AdFormData) => createAd(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-ads'] })
      queryClient.invalidateQueries({ queryKey: ['master-ad-requests'] })
      setMasterModalOpen(false)
      setApprovingRequest(null)
    },
  })

  const adUpdateMutation = useMutation({
    mutationFn: (data: AdFormData & { id: string }) => updateAd(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-ads'] })
      setMasterModalOpen(false)
      setEditingAd(null)
    },
  })

  const killSwitchMutation = useMutation({
    mutationFn: toggleKillSwitch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-kill-switch'] })
    },
  })

  const handleApproveRequest = useCallback((request: AdRequest) => {
    setApprovingRequest(request)
    setMasterModalOpen(true)
  }, [])

  const handleRejectRequest = useCallback((id: string) => {
    setConfirmDialog({ id, type: 'rejected' })
  }, [])

  const handleConfirmAction = useCallback(() => {
    if (!confirmDialog) return
    requestMutation.mutate({ id: confirmDialog.id, status: confirmDialog.type })
  }, [confirmDialog, requestMutation])

  const handleMasterSave = useCallback(
    async (data: AdFormData) => {
      if (editingAd) {
        await adUpdateMutation.mutateAsync({ ...data, id: editingAd.id })
      } else {
        await adMutation.mutateAsync(data)
      }
    },
    [editingAd, adMutation, adUpdateMutation]
  )

  const openEditAd = useCallback((ad: Ad) => {
    setEditingAd(ad)
    setApprovingRequest(null)
    setMasterModalOpen(true)
  }, [])

  const openNewAd = useCallback(() => {
    setEditingAd(null)
    setApprovingRequest(null)
    setMasterModalOpen(true)
  }, [])

  const closeMasterModal = useCallback(() => {
    setMasterModalOpen(false)
    setEditingAd(null)
    setApprovingRequest(null)
  }, [])

  const pendingRequests = requests.filter((r) => r.status === 'pending')
  const activeAds = ads.filter((a) => a.status === 'active')
  const totalClicks = ads.reduce((sum, a) => sum + a.clicks, 0)
  const totalImpressions = ads.reduce((sum, a) => sum + a.impressions, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={openNewAd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-all shadow-lg shadow-[var(--glow-color)]"
          >
            <Plus className="w-4 h-4" />
            إضافة إعلان
          </button>
          <button
            onClick={() => setClientModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium glass-card hover:border-[var(--primary)] transition-all"
          >
            <Megaphone className="w-4 h-4" />
            طلب إعلان (عميل)
          </button>
        </div>

        <button
          onClick={() => killSwitchMutation.mutate()}
          disabled={killSwitchMutation.isPending}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg',
            killSwitch?.active
              ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-500/30'
              : 'glass-card text-[var(--text-main)] hover:border-rose-400'
          )}
        >
          {killSwitchMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Skull className={cn('w-4 h-4', killSwitch?.active && 'animate-pulse')} />
          )}
          {killSwitch?.active ? 'Kill Switch مفعّل - اضغط للإيقاف' : 'Kill Switch - إيقاف جميع الإعلانات'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي الإعلانات', value: String(ads.length), icon: BarChart3 },
          { label: 'إجمالي النقرات', value: totalClicks.toLocaleString(), icon: MousePointerClick },
          { label: 'إجمالي المشاهدات', value: totalImpressions.toLocaleString(), icon: Eye },
          { label: 'الطلبات المعلقة', value: String(pendingRequests.length), icon: Clock },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="w-9 h-9 rounded-xl bg-[var(--primary-light)] flex items-center justify-center mb-3">
              <item.icon className="w-4 h-4 text-[var(--primary)]" />
            </div>
            <p className="text-2xl font-bold text-[var(--text-main)] tracking-tight mb-1">{item.value}</p>
            <p className="text-sm text-[var(--text-muted)]">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {pendingRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-[var(--sidebar-border)] flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-[var(--text-main)]">طلبات العملاء المعلقة</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
              {pendingRequests.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--sidebar-border)]">
                  <th className="text-right px-5 py-3 text-xs font-medium text-[var(--text-muted)] tracking-wider">النشاط التجاري</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-[var(--text-muted)] tracking-wider">واتساب</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-[var(--text-muted)] tracking-wider">القطاع</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-[var(--text-muted)] tracking-wider">الباقة</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-[var(--text-muted)] tracking-wider">التاريخ</th>
                  <th className="text-center px-5 py-3 text-xs font-medium text-[var(--text-muted)] tracking-wider">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((req, i) => (
                  <motion.tr
                    key={req.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-[var(--sidebar-border)] hover:bg-[var(--sidebar-hover-bg)] transition-colors"
                  >
                    <td className="px-5 py-3">
                      <span className="text-sm font-medium text-[var(--text-main)]">{req.client_info.business_name}</span>
                    </td>
                    <td className="px-5 py-3">
                      <code className="text-xs text-[var(--text-muted)]" dir="ltr">{req.client_info.whatsapp}</code>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm text-[var(--text-muted)]">{req.client_info.target_sector}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        req.campaign.package === 'exclusive' ? 'bg-purple-500/10 text-purple-400' :
                        req.campaign.package === 'video' ? 'bg-cyan-500/10 text-cyan-400' :
                        'bg-slate-500/10 text-slate-400'
                      )}>
                        {req.campaign.package === 'exclusive' ? 'حصري' : req.campaign.package === 'video' ? 'فيديو' : 'قياسي'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-[var(--text-muted)]">
                      {new Date(req.created_at).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleApproveRequest(req)}
                          disabled={requestMutation.isPending}
                          className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                          title="موافقة"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRejectRequest(req.id)}
                          disabled={requestMutation.isPending}
                          className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all disabled:opacity-50"
                          title="رفض"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-[var(--sidebar-border)] flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-[var(--primary)]" />
          <h3 className="text-sm font-bold text-[var(--text-main)]">جميع الإعلانات</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--primary-light)] text-[var(--primary)]">
            {ads.length}
          </span>
        </div>

        {adsLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" />
          </div>
        )}

        {!adsLoading && ads.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-[var(--text-muted)]">لا توجد إعلانات بعد</p>
            <button
              onClick={openNewAd}
              className="mt-3 text-sm text-[var(--primary)] hover:underline"
            >
              إضافة أول إعلان
            </button>
          </div>
        )}

        {!adsLoading && ads.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--sidebar-border)]">
                  <th className="text-right px-5 py-4 text-xs font-medium text-[var(--text-muted)] tracking-wider">الإعلان</th>
                  <th className="text-right px-5 py-4 text-xs font-medium text-[var(--text-muted)] tracking-wider">مساحة العرض</th>
                  <th className="text-right px-5 py-4 text-xs font-medium text-[var(--text-muted)] tracking-wider">النقرات</th>
                  <th className="text-right px-5 py-4 text-xs font-medium text-[var(--text-muted)] tracking-wider">المشاهدات</th>
                  <th className="text-right px-5 py-4 text-xs font-medium text-[var(--text-muted)] tracking-wider">حصرية</th>
                  <th className="text-right px-5 py-4 text-xs font-medium text-[var(--text-muted)] tracking-wider">تثبيت</th>
                  <th className="text-right px-5 py-4 text-xs font-medium text-[var(--text-muted)] tracking-wider">الحالة</th>
                  <th className="text-center px-5 py-4 text-xs font-medium text-[var(--text-muted)] tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {ads.map((ad, i) => (
                  <motion.tr
                    key={ad.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-[var(--sidebar-border)] hover:bg-[var(--sidebar-hover-bg)] transition-colors cursor-pointer"
                    onClick={() => openEditAd(ad)}
                  >
                    <td className="px-5 py-4">
                      <div>
                        <span className="text-sm font-medium text-[var(--text-main)]">{ad.ad_config.title}</span>
                        <p className="text-xs text-[var(--text-muted)] truncate max-w-[200px]">{ad.ad_config.description}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--sidebar-hover-bg)] text-[var(--text-muted)]">
                        {ad.ad_config.display_space}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--text-muted)]">{ad.clicks.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-[var(--text-muted)]">{ad.impressions.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      {ad.ad_config.is_exclusive ? (
                        <span className="text-xs text-purple-400">نعم</span>
                      ) : (
                        <span className="text-xs text-[var(--text-muted)]/50">لا</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {ad.ad_config.is_fixed ? (
                        <span className="text-xs text-cyan-400">نعم</span>
                      ) : (
                        <span className="text-xs text-[var(--text-muted)]/50">لا</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        'text-xs px-2.5 py-1 rounded-full',
                        ad.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      )}>
                        {ad.status === 'active' ? 'نشط' : 'متوقف'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEditAd(ad); }}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--sidebar-hover-bg)] transition-all"
                      >
                        <span className="text-xs">تحرير</span>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <ClientAdRequestModal
        open={clientModalOpen}
        onClose={() => setClientModalOpen(false)}
      />

      <MasterAdModal
        open={masterModalOpen}
        onClose={closeMasterModal}
        onSave={handleMasterSave}
        ad={editingAd}
        request={approvingRequest}
      />

      <GlassModal
        open={confirmDialog !== null}
        onClose={() => setConfirmDialog(null)}
        title={confirmDialog?.type === 'rejected' ? 'تأكيد الرفض' : 'تأكيد الموافقة'}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-sm text-[var(--text-muted)]">
              {confirmDialog?.type === 'rejected'
                ? 'هل أنت متأكد من رفض هذا الطلب؟ هذا الإجراء لا يمكن التراجع عنه.'
                : 'سيتم نشر هذا الإعلان بعد الموافقة. هل أنت متأكد؟'}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setConfirmDialog(null)}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--sidebar-hover-bg)] transition-all"
            >
              إلغاء
            </button>
            <button
              onClick={handleConfirmAction}
              disabled={requestMutation.isPending}
              className={cn(
                'flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2',
                confirmDialog?.type === 'rejected'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-[var(--primary)] hover:bg-[var(--primary-hover)]'
              )}
            >
              {requestMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {confirmDialog?.type === 'rejected' ? 'تأكيد الرفض' : 'تأكيد الموافقة'}
            </button>
          </div>
        </div>
      </GlassModal>
    </div>
  )
}
