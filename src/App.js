import { useState, useEffect } from "react";
import Lookbook from "./views/Lookbook";
import Inventory from "./views/Inventory";
import Assembler from "./views/Assembler";
import { defaultInventory } from "./data/inventory";

const NAV = [
  { key: "lookbook", label: "Lookbook", icon: "✦" },
  { key: "inventory", label: "Wardrobe", icon: "◈" },
  { key: "assembler", label: "Assemble", icon: "⊕" },
];

export default function App() {
  const [tab, setTab] = useState("lookbook");
  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem("wardrobe_inventory");
      return saved ? JSON.parse(saved) : defaultInventory;
    } catch { return defaultInventory; }
  });
  const [customOutfits, setCustomOutfits] = useState(() => {
    try {
      const saved = localStorage.getItem("wardrobe_custom_outfits");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("wardrobe_inventory", JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem("wardrobe_custom_outfits", JSON.stringify(customOutfits));
  }, [customOutfits]);

  return (
    <div style={{ minHeight: "100vh", background: "#000000", color: "#e8e8f0", fontFamily: "'Lexend', 'Helvetica Neue', sans-serif" }}>
      {/* Header */}
      <header style={{
        background: "#050505",
        borderBottom: "1px solid #ffffff0f",
        position: "sticky", top: 0, zIndex: 100,
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18, color: "#ffffff" }}>✦</span>
            <span style={{ fontFamily: "'Lexend', sans-serif", fontWeight: 700, fontSize: 17, color: "#f0f0ff", letterSpacing: "-0.3px" }}>
              THE WARDROBE
            </span>
          </div>
          <nav style={{ display: "flex", gap: 4 }}>
            {NAV.map(n => (
              <button key={n.key} onClick={() => setTab(n.key)} style={{
                background: tab === n.key ? "#ffffff18" : "transparent",
                border: tab === n.key ? "1px solid #ffffff44" : "1px solid transparent",
                borderRadius: 8,
                color: tab === n.key ? "#ffffff" : "#888",
                padding: "6px 14px",
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "'Courier New', monospace",
                letterSpacing: 0.5,
                transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ fontSize: 11 }}>{n.icon}</span>
                {n.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main>
        {tab === "lookbook" && (
          <Lookbook customOutfits={customOutfits} inventory={inventory} />
        )}
        {tab === "inventory" && (
          <Inventory inventory={inventory} setInventory={setInventory} />
        )}
        {tab === "assembler" && (
          <Assembler inventory={inventory} customOutfits={customOutfits} setCustomOutfits={setCustomOutfits} />
        )}
      </main>
    </div>
  );
}
