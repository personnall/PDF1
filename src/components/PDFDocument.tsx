import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 12,
    lineHeight: 1.5,
    color: '#333333',
  },
});

interface PDFDocumentProps {
  title: string;
  content: string;
}

export const PDFDocument = ({ title, content }: PDFDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.title}>{title || 'Untitled Document'}</Text>
        <Text style={styles.content}>{content || 'Start typing to see your content here...'}</Text>
      </View>
    </Page>
  </Document>
);
