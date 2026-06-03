export interface HeaderFooterConfig {
  enabled: boolean;
  text: string;
  showTitle: boolean;
  showDate: boolean;
  alignment: 'left' | 'center' | 'right';
  logo?: string;
}

export interface FooterConfig {
  enabled: boolean;
  text: string;
  showPageNumbers: boolean;
  showCopyright: boolean;
  alignment: 'left' | 'center' | 'right';
}

export interface HeaderFooterSettings {
  header: HeaderFooterConfig;
  footer: FooterConfig;
}

export const DEFAULT_HF_SETTINGS: HeaderFooterSettings = {
  header: {
    enabled: false,
    text: '',
    showTitle: true,
    showDate: false,
    alignment: 'center'
  },
  footer: {
    enabled: true,
    text: '',
    showPageNumbers: true,
    showCopyright: false,
    alignment: 'center'
  }
};
