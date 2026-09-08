import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app/app.js";

const root = document.querySelector<HTMLDivElement>("#root");
if (!root) throw new Error("Root element is missing");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
