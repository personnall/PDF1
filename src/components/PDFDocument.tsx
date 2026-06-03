import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { PageSettings } from '../types/settings';
import type { TextStyling } from '../types/styling';
import type { HeaderFooterSettings } from '../types/headerFooter';
import { UNIT_CONVERSION } from '../types/settings';

interface PDFDocumentProps {
  title: string;
  content: string;
  settings: PageSettings;
  styling: TextStyling;
  hf: HeaderFooterSettings;
}

export const PDFDocument = ({ title, content, settings, styling, hf }: PDFDocumentProps) => {
  const { pageSize, orientation, margins, unit } = settings;
  const factor = UNIT_CONVERSION[unit];

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      paddingTop: margins.top * factor + (hf.header.enabled ? 50 : 0),
      paddingBottom: margins.bottom * factor + (hf.footer.enabled ? 50 : 0),
      paddingLeft: margins.left * factor,
      paddingRight: margins.right * factor,
      fontFamily: styling.fontFamily,
    },
    header: {
      position: 'absolute',
      top: margins.top * factor,
      left: margins.left * factor,
      right: margins.right * factor,
      fontSize: 10,
      color: '#999',
      borderBottomWidth: 0.5,
      borderBottomColor: '#eee',
      paddingBottom: 5,
      display: hf.header.enabled ? 'flex' : 'none',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: hf.header.alignment === 'center' ? 'center' : (hf.header.alignment === 'right' ? 'flex-end' : 'flex-start'),
    },
    headerLogo: {
      width: 30,
      height: 30,
      marginRight: 10,
      objectFit: 'contain',
    },
    footer: {
      position: 'absolute',
      bottom: margins.bottom * factor,
      left: margins.left * factor,
      right: margins.right * factor,
      fontSize: 10,
      color: '#999',
      borderTopWidth: 0.5,
      borderTopColor: '#eee',
      paddingTop: 5,
      display: hf.footer.enabled ? 'flex' : 'none',
      flexDirection: 'row',
      justifyContent: hf.footer.alignment === 'center' ? 'center' : (hf.footer.alignment === 'right' ? 'flex-end' : 'flex-start'),
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      fontWeight: 'bold',
    },
    paragraph: {
      fontSize: styling.fontSize,
      lineHeight: styling.lineHeight,
      letterSpacing: styling.letterSpacing,
      textAlign: styling.textAlign,
      color: styling.textColor,
      marginBottom: styling.paragraphSpacing,
      textIndent: styling.firstLineIndent,
      fontWeight: styling.fontWeight as any,
    },
    listItem: {
      flexDirection: 'row',
      marginBottom: styling.paragraphSpacing / 2,
      marginLeft: 15,
    },
    bullet: {
      width: 10,
      fontSize: styling.fontSize,
    },
    listContent: {
      flex: 1,
      fontSize: styling.fontSize,
      lineHeight: styling.lineHeight,
      textAlign: styling.textAlign,
      color: styling.textColor,
    }
  });

  const parseContent = () => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Basic list detection
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listContent}>{line.trim().substring(2)}</Text>
          </View>
        );
      }

      const orderedMatch = line.trim().match(/^\d+\.\s(.*)/);
      if (orderedMatch) {
        return (
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>{line.trim().split('.')[0]}.</Text>
            <Text style={styles.listContent}>{orderedMatch[1]}</Text>
          </View>
        );
      }

      return (
        <Text key={index} style={styles.paragraph}>
          {line}
        </Text>
      );
    });
  };

  return (
    <Document>
      <Page size={pageSize} orientation={orientation} style={styles.page}>
        {/* Header */}
        <View style={styles.header} fixed>
          {hf.header.logo && <Image src={hf.header.logo} style={styles.headerLogo} />}
          <Text>
            {hf.header.text} {hf.header.showTitle && title} {hf.header.showDate && new Date().toLocaleDateString()}
          </Text>
        </View>

        <View>
          <Text style={styles.title}>{title || 'Untitled Document'}</Text>
          {parseContent()}
          {content.length === 0 && (
             <Text style={styles.paragraph}>Start typing to see your content here...</Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>
             {hf.footer.text} {hf.footer.showCopyright && `© ${new Date().getFullYear()}`}
          </Text>
          {hf.footer.showPageNumbers && (
            <Text
              render={({ pageNumber, totalPages }) => ` - Page ${pageNumber} of ${totalPages}`}
            />
          )}
        </View>
      </Page>
    </Document>
  );
};
