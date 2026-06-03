export interface TextStyling {
  fontFamily: 'Helvetica' | 'Times-Roman' | 'Courier';
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  lineHeight: number;
  letterSpacing: number;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  textColor: string;
  paragraphSpacing: number;
  firstLineIndent: number;
  sectionSpacing: number;
}

export const DEFAULT_STYLING: TextStyling = {
  fontFamily: 'Helvetica',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: 1.5,
  letterSpacing: 0,
  textAlign: 'left',
  textColor: '#333333',
  paragraphSpacing: 10,
  firstLineIndent: 0,
  sectionSpacing: 20
};
