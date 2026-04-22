import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { LeadsProvider } from "./context/LeadsContext";
import "./styles/index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LeadsProvider>
          <App />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#181c24",
                color: "#e8eaf0",
                border: "1px solid #252b3b",
                borderRadius: "10px",
                fontSize: "13.5px",
                fontFamily: "'DM Sans', sans-serif",
              },
              success: { iconTheme: { primary: "#6ee7b7", secondary: "#000" } },
              error: { iconTheme: { primary: "#f43f5e", secondary: "#fff" } },
            }}
          />
        </LeadsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
