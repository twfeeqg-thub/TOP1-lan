export type SubscriptionPlan = 'basic' | 'pro' | 'enterprise';

export interface UserSubscription {
  id: string;
  user_id: string;
  tenant_id: string | null;
  project_slug: string;
  plan: SubscriptionPlan;
  is_active: boolean;
  expires_at: string | null;
}

export const EDUCATIONAL_PROJECT_SLUGS = [
  'exam-engine',
  'teacher-twin',
  'school-management',
  'institute-management',
  'quran-circles',
] as const;

export const APP_SLUG_TO_PROJECT_SLUG: Record<string, string> = {
  'exam-engine': 'edu_exam',
  'teacher-twin': 'edu_twin',
  'school-management': 'edu_schools',
};

export const APP_SLUG_ROUTES: Record<string, string> = {
  'exam-engine': '/exam-engine',
};
