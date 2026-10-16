import { ToolItem } from '../types';
import { ToolContentOverride, AdsSettings } from '../types/admin';

export function applyAdminOverrides(tools: ToolItem[]): ToolItem[] {
  return tools;
}

export function recordToolExecution(toolId: string, toolName?: string): void {
  // Client-side execution counter stub
}

export function recordSearchQuery(query: string): void {
  // Client-side query counter stub
}

export function recordPageView(view: string): void {
  // Client-side pageview counter stub
}

export function getToolOverrides(toolId?: string): Record<string, Partial<ToolContentOverride>> {
  return {};
}

export function getAdsSettings(): AdsSettings {
  try {
    const saved = localStorage.getItem('ed_ads_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed.adsensePublisherId === 'string' && parsed.adsensePublisherId) {
        return parsed;
      }
    }
  } catch (e) {}

  return {
    enabled: true,
    adsensePublisherId: 'ca-pub-7730607896444632',
  };
}

export function saveAdsSettings(settings: AdsSettings): void {
  try {
    localStorage.setItem('ed_ads_settings', JSON.stringify(settings));
  } catch (e) {}
}
