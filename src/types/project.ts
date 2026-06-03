import type { PageSettings } from './settings';
import type { TextStyling } from './styling';
import type { HeaderFooterSettings } from './headerFooter';

export interface Project {
  id: string;
  title: string;
  content: string;
  settings: PageSettings;
  styling: TextStyling;
  hf: HeaderFooterSettings;
  updatedAt: number;
}

export interface ProjectMetadata {
  id: string;
  title: string;
  updatedAt: number;
}
