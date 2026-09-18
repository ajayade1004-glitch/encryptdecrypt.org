export interface ToolItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryName: string;
  shortDesc: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords?: string[];
  lsiKeywords?: string[];
  inputType: 'textarea' | 'text' | 'file' | 'number' | 'dual' | string;
  hasFileSupport: boolean;
  icon?: string;
  related: string[];
  popular: boolean;
}

export interface CategoryInfo {
  slug: string;
  name: string;
  count: number;
  description: string;
}

export interface ToolExecutionResult {
  output: string;
  error?: string;
  metadata?: Record<string, string | number | boolean>;
}
