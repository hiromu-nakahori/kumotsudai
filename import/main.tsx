
// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json"; // amplify pull で生成された構成
import App from "./App.tsx";

// Amplifyを初期化（Gen2構成）
Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
