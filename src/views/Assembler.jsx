import { useState } from "react";
import { categoryColors } from "../data/outfits";

const SLOT_CONFIG = [
  { key: "top",    label: "Top",          icon: "👕", cats: ["Hoodie","Sweatshirt","Shirt"] },
  { key: "extra",  label: "Layer (opt.)",  icon: "🧥", cats: ["Vest","Jacket","Hoodie","Sweatshirt"], optional: true },
  { key: "bottom", label: "Bottom",        icon: "👖", cats: ["Jeans","Chinos","Joggers","Sweatpants","Track Pants"] },
  { key: "shoes",  label: "Shoes",         icon: "👟", cats: ["Shoes"] },
  { key: "socks",  label: "Socks",         icon: "🧦", cats: ["Socks"] },
];

const OUTFIT_CATS = ["Streetwear","Casual","Athletic","Smart Casual","Edgy","Light & Summer","Vintage & Retro","Boot Fits","Converse Fits","Vans Fits","Supra Fits","Adidas Fits","Nike Fits","Layered Looks","Monochrome","Hoodie Fits","Vest Fits","High Top Fits","Low Top Fits","Mid Top Fits","Jacket Fits","Custom"];

const inputStyle = {
  background: "#050505", border: "1px solid #ffffff12", borderRadius: 8,
  color: "#e8e8f0", padding: "9px 12px", fontSize: 13, fontFamily: "'Lexend', sans-serif",
  outline: "none", width: "100%", boxSizing: "border-box",
};

function SlotPicker({ slot, inventory, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const options = inventory.filter(i => slot.cats.includes(i.category));
  const selectedItem = inventory.find(i => i.id === selected);

  return (
    <div style={{ position: "relative" }}>
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#666", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 5 }}>
        {slot.icon} {slot.label}
      </div>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", background: selectedItem ? "#151528" : "#0d0d1a",
        border: selectedItem ? "1px solid #e8ff4a30" : "1px dashed #ffffff14",
        borderRadius: 10, padding: "11px 14px", textAlign: "left", cursor: "pointer",
        color: selectedItem ? "#e8e8f0" : "#444",
        fontFamily: "'Lexend', sans-serif", fontSize: 13, display: "flex", alignItems: "center", gap: 10,
      }}>
        {selectedItem && (
          <div style={{ width: 18, height: 18, borderRadius: 5, background: selectedItem.color, border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0 }} />
        )}
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {selectedItem ? selectedItem.name : slot.optional ? "None (skip)" : "Choose..."}
        </span>
        <span style={{ color: "#444", fontSize: 10 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50,
          background: "#0a0a0a", border: "1px solid #ffffff12", borderRadius: 10,
          maxHeight: 220, overflowY: "auto",
          boxShadow: "0 8px 32px #000000aa",
        }}>
          {slot.optional && (
            <div onClick={() => { onSelect(null); setOpen(false); }}
              style={{ padding: "10px 14px", cursor: "pointer", color: "#555", fontFamily: "'Lexend', sans-serif", fontSize: 13,
                borderBottom: "1px solid #ffffff08",
                background: selected === null ? "#e8ff4a0a" : "transparent" }}>
              None
            </div>
          )}
          {options.map(item => (
            <div key={item.id} onClick={() => { onSelect(item.id); setOpen(false); }} style={{
              padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
              background: selected === item.id ? "#e8ff4a0a" : "transparent",
              borderBottom: "1px solid #ffffff06",
            }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: item.color, border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0 }} />
              <span style={{ color: "#ccc", fontFamily: "'Lexend', sans-serif", fontSize: 13 }}>{item.name}</span>
            </div>
          ))}
          {options.length === 0 && (
            <div style={{ padding: "10px 14px", color: "#444", fontFamily: "'Lexend', sans-serif", fontSize: 12 }}>
              No items in this category
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Assembler({ inventory, customOutfits, setCustomOutfits }) {
  const [slots, setSlots] = useState({ top: null, extra: null, bottom: null, shoes: null, socks: null });
  const [form, setForm] = useState({ name: "", vibe: "", note: "", category: "Custom" });
  const [saved, setSaved] = useState(false);

  const setSlot = (key, val) => setSlots(s => ({ ...s, [key]: val }));

  const getItem = (id) => id ? inventory.find(i => i.id === id) : null;

  const canSave = slots.top && slots.bottom && slots.shoes && slots.socks && form.name.trim();

  const handleSave = () => {
    const topItem = getItem(slots.top);
    const extraItem = getItem(slots.extra);
    const bottomItem = getItem(slots.bottom);
    const shoesItem = getItem(slots.shoes);
    const socksItem = getItem(slots.socks);

    const newOutfit = {
      id: `custom_${Date.now()}`,
      category: form.category,
      name: form.name.trim(),
      top: topItem?.name || "",
      extra: extraItem?.name || null,
      bottom: bottomItem?.name || "",
      shoes: shoesItem?.name || "",
      socks: socksItem?.name || "",
      vibe: form.vibe.trim() || "My custom fit",
      note: form.note.trim() || null,
      colors: [topItem?.color || "#888", bottomItem?.color || "#888", shoesItem?.color || "#888"],
    };

    setCustomOutfits(prev => [...prev, newOutfit]);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setSlots({ top: null, extra: null, bottom: null, shoes: null, socks: null });
    setForm({ name: "", vibe: "", note: "", category: "Custom" });
  };

  const preview = [
    { label: "TOP", val: getItem(slots.top)?.name },
    { label: "LAYER", val: getItem(slots.extra)?.name },
    { label: "BOTTOM", val: getItem(slots.bottom)?.name },
    { label: "SHOES", val: getItem(slots.shoes)?.name },
    { label: "SOCKS", val: getItem(slots.socks)?.name },
  ].filter(r => r.val);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#e8ff4a", letterSpacing: 4, textTransform: "uppercase", marginBottom: 4, opacity: 0.8 }}>
          {customOutfits.length} custom outfits saved
        </div>
        <h1 style={{ margin: 0, fontSize: "clamp(24px, 4vw, 44px)", fontFamily: "'Lexend', sans-serif", fontWeight: 700, color: "#f0f0ff", letterSpacing: "-1px", lineHeight: 1 }}>
          ASSEMBLE A FIT
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Left: Slot pickers */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <h3 style={{ margin: "0 0 4px", fontFamily: "'Courier New', monospace", fontSize: 11, color: "#888", letterSpacing: 2, textTransform: "uppercase" }}>Choose Pieces</h3>
          {SLOT_CONFIG.map(slot => (
            <SlotPicker key={slot.key} slot={slot} inventory={inventory}
              selected={slots[slot.key]} onSelect={val => setSlot(slot.key, val)} />
          ))}
        </div>

        {/* Right: Details + Preview */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Preview card */}
          <div style={{
            background: "#0a0a0a", border: "1px solid #e8ff4a18", borderRadius: 14,
            padding: 18, minHeight: 160,
          }}>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#e8ff4a", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10, opacity: 0.8 }}>
              Preview
            </div>
            {preview.length === 0 ? (
              <div style={{ color: "#333", fontFamily: "'Lexend', sans-serif", fontSize: 13, paddingTop: 10 }}>
                Select pieces to preview your fit...
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {preview.map(r => (
                  <div key={r.label} style={{ display: "flex", gap: 10 }}>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#e8ff4a", letterSpacing: 1.5, fontWeight: 700, minWidth: 46, paddingTop: 1, opacity: 0.7 }}>{r.label}</span>
                    <span style={{ fontSize: 12.5, color: "#ccc", fontFamily: "'Lexend', sans-serif" }}>{r.val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save form */}
          <div style={{ background: "#080808", border: "1px solid #ffffff0a", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
            <h3 style={{ margin: "0 0 4px", fontFamily: "'Courier New', monospace", fontSize: 11, color: "#888", letterSpacing: 2, textTransform: "uppercase" }}>Save to Lookbook</h3>

            <div>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#555", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 5 }}>Outfit Name *</div>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Give it a name..." style={inputStyle} />
            </div>

            <div>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#555", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 5 }}>Vibe</div>
              <input value={form.vibe} onChange={e => setForm(f => ({ ...f, vibe: e.target.value }))} placeholder="Describe the vibe..." style={inputStyle} />
            </div>

            <div>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#555", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 5 }}>Fit Tip (optional)</div>
              <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="How to wear it..." style={inputStyle} />
            </div>

            <div>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#555", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 5 }}>Category</div>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
                {OUTFIT_CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <button onClick={handleSave} disabled={!canSave} style={{
              background: canSave ? "linear-gradient(135deg, #e8ff4a, #b8cc20)" : "#ffffff0a",
              border: "none", borderRadius: 10, color: canSave ? "#0a0a0f" : "#333",
              padding: "12px 0", fontFamily: "'Courier New', monospace",
              fontWeight: 700, fontSize: 12, letterSpacing: 1, cursor: canSave ? "pointer" : "default",
              transition: "all 0.2s",
            }}>
              {saved ? "✓ Saved to Lookbook!" : "Save Outfit"}
            </button>
          </div>
        </div>
      </div>

      {/* Saved custom outfits */}
      {customOutfits.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#888", letterSpacing: 2, textTransform: "uppercase" }}>Saved Custom Outfits</span>
            <div style={{ flex: 1, height: 1, background: "#ffffff08" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {customOutfits.map((o, i) => {
              const tagColor = categoryColors[o.category] || "#e8ff4a";
              return (
                <div key={o.id || i} style={{
                  background: "#0a0a0a", border: "1px solid #ffffff0e", borderRadius: 12, padding: "14px 16px",
                  position: "relative",
                }}>
                  <button onClick={() => setCustomOutfits(prev => prev.filter((_, j) => j !== i))}
                    style={{ position: "absolute", top: 10, right: 10, background: "transparent", border: "none", color: "#333", cursor: "pointer", fontSize: 13 }}>✕</button>
                  <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: tagColor, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>{o.category}</div>
                  <div style={{ fontFamily: "'Lexend', sans-serif", fontSize: 14, fontWeight: 700, color: "#ddd", marginBottom: 2 }}>{o.name}</div>
                  <div style={{ fontSize: 10, color: "#555", fontFamily: "'Lexend', sans-serif", fontStyle: "italic", marginBottom: 10 }}>"{o.vibe}"</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {o.colors.map((c, ci) => (
                      <div key={ci} style={{ width: 12, height: 12, borderRadius: "50%", background: c, border: "1px solid rgba(255,255,255,0.12)" }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
