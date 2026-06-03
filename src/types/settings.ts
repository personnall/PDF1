export type PageSize = 'A4' | 'LETTER' | 'LEGAL' | 'A5';
export type Orientation = 'portrait' | 'landscape';
export type Unit = 'mm' | 'px' | 'in';

export interface Margins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface PageSettings {
  pageSize: PageSize;
  orientation: Orientation;
  margins: Margins;
  unit: Unit;
}

export const UNIT_CONVERSION = {
  mm: 2.83465, // 1mm = 2.83465 pts
  in: 72,      // 1in = 72 pts
  px: 0.75     // 1px = 0.75 pts (assuming 96dpi, 72/96)
};

export const DEFAULT_SETTINGS: PageSettings = {
  pageSize: 'A4',
  orientation: 'portrait',
  margins: {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
  },
  unit: 'mm'
};
