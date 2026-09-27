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
  return {
    enabled: false,
    adsensePublisherId: '',
  };
}
