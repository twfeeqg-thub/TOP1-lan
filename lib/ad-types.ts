export type AdPlacement = 'top' | 'middle' | 'bottom'
export type AdDisplaySpace = 'Login' | 'Full_Screen' | 'Banner' | 'Native'
export type AdPackage = 'standard' | 'exclusive' | 'video'
export type AdLang = 'ar' | 'en'
export type RequestStatus = 'pending' | 'approved' | 'rejected'
export type AdStatus = 'active' | 'inactive'
export type CtaType = 'visit' | 'call' | 'whatsapp' | 'subscribe'

export interface ClientInfo {
  business_name: string
  whatsapp: string
  target_sector: string
}

export interface CampaignInfo {
  start_date: string
  end_date: string
  package: AdPackage
}

export interface AdAttachments {
  card_url?: string
  payment_proof_url?: string
}

export interface DesignRequest {
  marketing_text?: string
  logo_url?: string
  preferred_colors?: string
  cta_type?: CtaType
}

export interface AdRequest {
  id: string
  client_info: ClientInfo
  campaign: CampaignInfo
  attachments: AdAttachments
  design_request?: DesignRequest
  status: RequestStatus
  created_at: string
  updated_at?: string
}

export interface AdConfig {
  title: string
  description: string
  targetUrl: string
  placement: AdPlacement
  display_space: AdDisplaySpace
  lang: AdLang
  is_exclusive: boolean
  is_fixed: boolean
  cta_type?: CtaType
}

export interface Ad {
  id: string
  ad_config: AdConfig
  media_url?: string
  request_id?: string
  status: AdStatus
  clicks: number
  impressions: number
  budget?: string
  platform?: string
  created_at: string
}

export interface KillSwitchState {
  active: boolean
  toggled_at: string
}
