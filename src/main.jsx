import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import InstallPrompt from "./components/InstallPrompt.jsx";
import registerServiceWorker from "./services/registerServiceWorker.js";

registerServiceWorker();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <InstallPrompt />
  </StrictMode>
);
