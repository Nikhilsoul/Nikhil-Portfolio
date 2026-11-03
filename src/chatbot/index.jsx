import React from "react";
import { createRoot } from "react-dom/client";
import NikhilChatbot from "./Chatbot.jsx";

// Mounts the chatbot in its own container, completely separate from the portfolio's React tree.
function mount() {
  if (document.getElementById("nk-chatbot-root")) return;
  const el = document.createElement("div");
  el.id = "nk-chatbot-root";
  document.body.appendChild(el);
  createRoot(el).render(<NikhilChatbot />);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
else mount();
