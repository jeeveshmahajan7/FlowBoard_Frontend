import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./index.css";
import App from "./App.jsx";
import { FlowBoardProvider } from "./context/FlowBoardContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FlowBoardProvider>
      <Router>
        <App />
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </FlowBoardProvider>
  </StrictMode>
);
