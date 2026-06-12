import JSZip from 'jszip';

export const extractTextFromPptx = async (file: File): Promise<string> => {
  const zip = await JSZip.loadAsync(file);
  let fullText = "";

  // PPTX slides are usually in ppt/slides/slideN.xml
  const slideFiles = Object.keys(zip.files).filter(name => name.startsWith('ppt/slides/slide') && name.endsWith('.xml'));

  // Sort slides numerically
  slideFiles.sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || "0");
    const numB = parseInt(b.match(/\d+/)?.[0] || "0");
    return numA - numB;
  });

  for (const slidePath of slideFiles) {
    const content = await zip.file(slidePath)?.async('text');
    if (!content) continue;

    // Simple XML text extraction (look for <a:t> tags)
    const slideNum = slidePath.match(/\d+/)?.[0];
    fullText += `\n# Slide ${slideNum}\n\n`;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, "text/xml");
    const textElements = xmlDoc.getElementsByTagName("a:t");

    for (let i = 0; i < textElements.length; i++) {
      fullText += (textElements[i].textContent || "") + " ";
    }
    fullText += "\n";
  }

  return fullText || "No text content found in PPTX.";
};
