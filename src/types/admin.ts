export interface ToolContentOverride {
  title?: string;
  shortDesc?: string;
  customContent?: string;
  longDescription?: string;
}

export interface AdminSettings {
  siteTitle?: string;
  maintenanceMode?: boolean;
}

export interface AdsSettings {
  enabled: boolean;
  adsensePublisherId: string;
  headerSlot?: string;
  sidebarSlot?: string;
}
