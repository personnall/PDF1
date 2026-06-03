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
  const { pageSize, orientation, margins, unit, backgroundColor, borderColor, borderWidth, watermark } = settings;
  const factor = UNIT_CONVERSION[unit];

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: backgroundColor,
      paddingTop: margins.top * factor + (hf.header.enabled ? 50 : 0),
      paddingBottom: margins.bottom * factor + (hf.footer.enabled ? 50 : 0),
      paddingLeft: margins.left * factor,
      paddingRight: margins.right * factor,
      fontFamily: styling.fontFamily,
      borderWidth: borderWidth,
      borderColor: borderColor,
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
    watermark: {
      position: 'absolute',
      top: '40%',
      left: '20%',
      right: '20%',
      opacity: watermark.opacity,
      color: watermark.color,
      fontSize: watermark.fontSize,
      textAlign: 'center',
      transform: `rotate(${watermark.rotation}deg)`,
      zIndex: -1,
    },
    mainContent: {
      columnCount: styling.columns,
      columnGap: styling.columnGap,
    },
    docTitle: {
      fontSize: 24,
      marginBottom: 20,
      fontWeight: 'bold',
      textAlign: styling.textAlign,
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
    heading1: {
      fontSize: styling.fontSize * 1.5,
      fontWeight: 'bold',
      marginTop: styling.sectionSpacing,
      marginBottom: styling.paragraphSpacing,
      color: styling.textColor,
    },
    heading2: {
      fontSize: styling.fontSize * 1.2,
      fontWeight: 'bold',
      marginTop: styling.sectionSpacing * 0.8,
      marginBottom: styling.paragraphSpacing,
      color: styling.textColor,
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
    },
    image: {
      marginBottom: styling.paragraphSpacing,
      borderRadius: 4,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    tableCell: {
      flex: 1,
      padding: 5,
      fontSize: styling.fontSize * 0.8,
    },
    tocTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      marginTop: 20,
    },
    tocItem: {
      fontSize: 12,
      marginBottom: 5,
      color: '#0066cc',
    }
  });

  const parseContent = () => {
    const lines = content.split('\n');
    const elements: any[] = [];
    const toc: { title: string, level: number }[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (trimmedLine === '[page-break]') {
        elements.push(<View key={`pb-${index}`} break />);
        return;
      }

      if (trimmedLine.startsWith('# ')) {
        const titleText = trimmedLine.substring(2);
        toc.push({ title: titleText, level: 1 });
        elements.push(<Text key={index} style={styles.heading1}>{titleText}</Text>);
        return;
      }
      if (trimmedLine.startsWith('## ')) {
        const titleText = trimmedLine.substring(3);
        toc.push({ title: titleText, level: 2 });
        elements.push(<Text key={index} style={styles.heading2}>{titleText}</Text>);
        return;
      }

      // Image support with optional width: [image:src|50%] or [image:src]
      const imageMatch = trimmedLine.match(/^\[image:(.*?)(?:\|(.*?))?\]$/);
      if (imageMatch) {
        const src = imageMatch[1];
        const width = imageMatch[2] || '100%';
        elements.push(<Image key={index} src={src} style={{ ...styles.image, width }} />);
        return;
      }

      if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
        const cells = trimmedLine.split('|').filter(c => c.trim() !== '');
        elements.push(
          <View key={index} style={styles.tableRow}>
            {cells.map((cell, i) => (
              <View key={i} style={styles.tableCell}>
                <Text>{cell.trim()}</Text>
              </View>
            ))}
          </View>
        );
        return;
      }

      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        elements.push(
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listContent}>{trimmedLine.substring(2)}</Text>
          </View>
        );
        return;
      }

      const orderedMatch = trimmedLine.match(/^\d+\.\s(.*)/);
      if (orderedMatch) {
        elements.push(
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>{trimmedLine.split('.')[0]}.</Text>
            <Text style={styles.listContent}>{orderedMatch[1]}</Text>
          </View>
        );
        return;
      }

      if (trimmedLine === '') {
        elements.push(<View key={index} style={{ height: styling.paragraphSpacing }} />);
      } else {
        elements.push(
          <Text key={index} style={styles.paragraph}>
            {line}
          </Text>
        );
      }
    });

    const finalElements = [];
    if (content.includes('[toc]')) {
      finalElements.push(
        <View key="toc-container">
          <Text style={styles.tocTitle}>Table of Contents</Text>
          {toc.map((item, i) => (
            <Text key={`toc-${i}`} style={{ ...styles.tocItem, marginLeft: (item.level - 1) * 20 }}>
              {item.title}
            </Text>
          ))}
        </View>
      );
    }
    finalElements.push(...elements);

    return finalElements;
  };

  return (
    <Document>
      <Page size={pageSize} orientation={orientation} style={styles.page}>
        {watermark.enabled && (
          <View style={styles.watermark} fixed>
            <Text>{watermark.text}</Text>
          </View>
        )}

        <View style={styles.header} fixed>
          {hf.header.logo && <Image src={hf.header.logo} style={styles.headerLogo} />}
          <Text>
            {hf.header.text} {hf.header.showTitle && title} {hf.header.showDate && new Date().toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.mainContent}>
          <Text style={styles.docTitle}>{title || 'Untitled Project'}</Text>
          {parseContent()}
          {content.length === 0 && (
             <Text style={styles.paragraph}>Start your professional project...</Text>
          )}
        </View>

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
