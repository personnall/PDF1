import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { PageSettings } from '../types/settings';
import { UNIT_CONVERSION } from '../types/settings';

interface PDFDocumentProps {
  title: string;
  content: string;
  settings: PageSettings;
}

export const PDFDocument = ({ title, content, settings }: PDFDocumentProps) => {
  const { pageSize, orientation, margins, unit } = settings;
  const factor = UNIT_CONVERSION[unit];

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      paddingTop: margins.top * factor,
      paddingBottom: margins.bottom * factor,
      paddingLeft: margins.left * factor,
      paddingRight: margins.right * factor,
      fontFamily: 'Helvetica',
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      fontWeight: 'bold',
    },
    paragraph: {
      fontSize: 12,
      lineHeight: 1.5,
      color: '#333333',
      marginBottom: 10,
    },
    pageNumber: {
      position: 'absolute',
      fontSize: 10,
      bottom: (margins.bottom * factor) / 2,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: 'grey',
    },
  });

  const paragraphs = content.split('\n');

  return (
    <Document>
      <Page size={pageSize} orientation={orientation} style={styles.page}>
        <View>
          <Text style={styles.title}>{title || 'Untitled Document'}</Text>
          {paragraphs.map((p, i) => (
            <Text key={i} style={styles.paragraph}>{p}</Text>
          ))}
          {content.length === 0 && (
             <Text style={styles.paragraph}>Start typing to see your content here...</Text>
          )}
        </View>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
};
