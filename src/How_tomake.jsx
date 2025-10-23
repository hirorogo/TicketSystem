import { Document, Page, pdfjs } from 'react-pdf';
import { useState } from 'react';

// pdf.js ワーカー設定（Vite/ESM）
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

function PDFViewer() {
  const [numPages, setNumPages] = useState(0);

  return (
    <div className="flex flex-col items-center">
      <Document
        file="/TicketSystem/assets/seisaku.pdf" // public/assets/seisaku.pdf に配置
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        onLoadError={(e) => console.error('PDF load error:', e)}
        loading="読み込み中..."
        error="PDFを読み込めませんでした"
      >
        {Array.from({ length: numPages }, (_, index) => (
          <Page key={index} pageNumber={index + 1} width={800} />
        ))}
      </Document>
    </div>
  );
}

export default PDFViewer;
export { PDFViewer };
