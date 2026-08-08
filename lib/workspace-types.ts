// ============================================================
// Client Workspace — editable config surface types (Phase 4)
//
// Client-safe, dependency-free. Describes the TYPED slice of the free-form
// `modules_config` / `config_override` JSONB that the customizer tabs edit.
// The merge/diff engine works generically over the JSONB — these types only
// give the React surface a stable shape.
// ============================================================

export interface WorkspaceModule {
  id: string;
  enabled: boolean;
  order: number;
  label_ar?: string;
  label_en?: string;
}

export interface WorkspaceAppearance {
  /** Primary brand color — mirrors the `--primary` CSS variable. */
  primary?: string;
  /** Soft tinted background — mirrors `--primary-light`. */
  primary_light?: string;
  /** Accent color (rosy-pink compatible). */
  accent?: string;
  /** Page background color. */
  background?: string;
  /** Glass blur strength in px. */
  glass_blur?: string;
  /** Grid density of the home hero layout. */
  grid_density?: 'low' | 'medium' | 'high';
  /** Preferred theme variant. */
  theme?: 'light' | 'dark' | 'pink' | 'auto';
}

export interface WorkspaceContent {
  hero_headline_ar?: string;
  hero_headline_en?: string;
  hero_subtitle_ar?: string;
  hero_subtitle_en?: string;
  cta_primary_ar?: string;
  cta_primary_en?: string;
  welcome_ar?: string;
  welcome_en?: string;
}

/**
 * The editable surface the customizer tabs manipulate. Top-level keys
 * (`title_ar`, `description_ar`, `icon`, `accent_color`, `features_*`) mirror
 * the canonical `modules_config` shape used by the landing renderer; the
 * nested `appearance` / `content` / `modules` sections are the new Phase 4
 * customization extensions (stored as plain JSONB deltas).
 */
export interface EditableWorkspaceConfig {
  title_ar?: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  icon?: string;
  badge_ar?: string;
  badge_en?: string;
  accent_color?: string;
  /** Platform branding asset URLs (global: /master/settings; tenant: workspace). */
  logo_url?: string;
  favicon_url?: string;
  pwa_icon_url?: string;
  /** Tier flag for custom brand uploads, read from the compiled config. */
  feature?: {
    branding?: {
      custom_upload?: boolean;
    };
  };
  features_ar?: string[];
  features_en?: string[];
  appearance?: WorkspaceAppearance;
  content?: WorkspaceContent;
  modules?: WorkspaceModule[];
}
