import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import PDFViewer from "./How_tomake"; // PDFViewerをインポート

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <PDFViewer />
  </React.StrictMode>
);
