import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { CloudinaryImageSelector } from "./CloudinaryImageSelector";
import { EnsureKontentAsParent } from "./EnsureKontentAsParent";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Invalid HTML. Cannot find element #root.");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <EnsureKontentAsParent>
      <CloudinaryImageSelector />
    </EnsureKontentAsParent>
  </React.StrictMode>,
);
