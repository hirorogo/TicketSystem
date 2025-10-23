import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import AdminPanel from "./AdminPanel";
import StatusDisplay from "./StatusDisplay";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename="/TicketSystem">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/status" element={<StatusDisplay />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);