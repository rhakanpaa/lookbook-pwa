import { useState } from "react";
import { itemCategories, shoeTypes } from "../data/inventory";

const CATEGORY_ICONS = {
  Hoodie: "🧥", Sweatshirt: "👕", Shirt: "👔", Vest: "🦺", Jacket: "🧥",
  Jeans: "👖", Chinos: "👖", Joggers: "👖", Sweatpants: "👖", "Track Pants": "👖",
  Shoes: "👟", Socks: "🧦",
};

const categoryOrder = ["Hoodie","Sweatshirt","Shirt","Vest","Jacket","Jeans","Chinos","Joggers","Sweatpants","Track Pants","Shoes","Socks"];

function AddItemModal({ onSave, onClose }) {
  const [form, setForm] = useState({ category: "Hoodie", name: "", color: "#888888", colorLabel: "", shoeType: "Low Top" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const isShoe = form.category === "Shoes";

  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000090", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div style={{ background: "#0a0a0a", border: "1px solid #ffffff18", borderRadius: 18, padding: 28, maxWidth: 400, width: "100%" }} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin: "0 0 20px", fontFamily: "'Lexend', sans-serif", color: "#eeeeff", fontSize: 18 }}>Add New Item</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <label style={labelStyle}>
            <span style={labelText}>Category</span>
            <select value={form.category} onChange={e => set("category", e.target.value)} style={inputStyle}>
              {itemCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          <label style={labelStyle}>
            <span style={labelText}>Name</span>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. White Hoodie" style={inputStyle} />
          </label>

          <label style={labelStyle}>
            <span style={labelText}>Color Label</span>
            <input value={form.colorLabel} onChange={e => set("colorLabel", e.target.value)} placeholder="e.g. White" style={inputStyle} />
          </label>

          <label style={labelStyle}>
            <span style={labelText}>Color Swatch</span>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input type="color" value={form.color} onChange={e => set("color", e.target.value)}
                style={{ width: 44, height: 36, border: "1px solid #ffffff18", borderRadius: 8, background: "transparent", cursor: "pointer" }} />
              <span style={{ color: "#666", fontSize: 12, fontFamily: "Courier New" }}>{form.color}</span>
            </div>
          </label>

          {isShoe && (
            <label style={labelStyle}>
              <span style={labelText}>Shoe Type</span>
              <select value={form.shoeType} onChange={e => set("shoeType", e.target.value)} style={inputStyle}>
                {shoeTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
          )}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <button onClick={() => {
            if (!form.name.trim()) return;
            onSave({ ...form, id: `custom_${Date.now()}` });
            onClose();
          }} style={primaryBtn}>Add Item</button>
          <button onClick={onClose} style={secondaryBtn}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: "flex", flexDirection: "column", gap: 5 };
const labelText = { fontFamily: "'Courier New', monospace", fontSize: 10, color: "#666", letterSpacing: 1.5, textTransform: "uppercase" };
const inputStyle = {
  background: "#050505", border: "1px solid #ffffff12", borderRadius: 8,
  color: "#e8e8f0", padding: "9px 12px", fontSize: 13, fontFamily: "'Lexend', sans-serif",
  outline: "none", width: "100%", boxSizing: "border-box",
};
const primaryBtn = {
  flex: 1, background: "#e8ff4a", border: "none", borderRadius: 10, color: "#0a0a0f",
  padding: "11px 0", fontFamily: "'Courier New', monospace", fontWeight: 700,
  fontSize: 12, letterSpacing: 1, cursor: "pointer",
};
const secondaryBtn = {
  flex: 1, background: "#ffffff0a", border: "1px solid #ffffff12", borderRadius: 10,
  color: "#666", padding: "11px 0", fontFamily: "'Courier New', monospace",
  fontSize: 12, letterSpacing: 1, cursor: "pointer",
};

export default function Inventory({ inventory, setInventory }) {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const addItem = (item) => setInventory(inv => [...inv, item]);
  const deleteItem = (id) => setInventory(inv => inv.filter(i => i.id !== id));

  const filteredInv = inventory.filter(i =>
    !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = categoryOrder.reduce((acc, cat) => {
    const items = filteredInv.filter(i => i.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  // Also catch categories not in default order
  filteredInv.forEach(i => {
    if (!grouped[i.category]) grouped[i.category] = [i];
  });

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#e8ff4a", letterSpacing: 4, textTransform: "uppercase", marginBottom: 4, opacity: 0.8 }}>
            {inventory.length} items
          </div>
          <h1 style={{ margin: 0, fontSize: "clamp(24px, 4vw, 44px)", fontFamily: "'Lexend', sans-serif", fontWeight: 700, color: "#f0f0ff", letterSpacing: "-1px", lineHeight: 1 }}>
            MY WARDROBE
          </h1>
        </div>
        <button onClick={() => setShowAdd(true)} style={primaryBtn}>+ Add Item</button>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search wardrobe..."
        style={{ ...inputStyle, marginBottom: 28, display: "block" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {Object.entries(grouped).map(([cat, items]) => (
          <section key={cat}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 15 }}>{CATEGORY_ICONS[cat] || "●"}</span>
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#888", letterSpacing: 2, textTransform: "uppercase" }}>{cat}</span>
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: "#444", letterSpacing: 1 }}>({items.length})</span>
              <div style={{ flex: 1, height: 1, background: "#ffffff08" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
              {items.map(item => (
                <div key={item.id} style={{
                  background: "#0a0a0a", border: "1px solid #ffffff0e", borderRadius: 12,
                  padding: "14px 14px 12px",
                  display: "flex", alignItems: "center", gap: 12, position: "relative",
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, background: item.color,
                    border: "1.5px solid rgba(255,255,255,0.12)", flexShrink: 0,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, color: "#ddd", fontFamily: "'Lexend', sans-serif", lineHeight: 1.3,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.name}
                    </div>
                    {item.colorLabel && (
                      <div style={{ fontSize: 10, color: "#555", fontFamily: "Courier New", letterSpacing: 0.5, marginTop: 2 }}>
                        {item.colorLabel}{item.shoeType ? ` · ${item.shoeType}` : ""}
                      </div>
                    )}
                  </div>
                  <button onClick={() => setConfirmDelete(item.id)} style={{
                    background: "transparent", border: "none", color: "#444", cursor: "pointer",
                    fontSize: 14, padding: 2, lineHeight: 1, flexShrink: 0,
                  }}>✕</button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {showAdd && <AddItemModal onSave={addItem} onClose={() => setShowAdd(false)} />}

      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "#00000090", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(4px)" }} onClick={() => setConfirmDelete(null)}>
          <div style={{ background: "#0a0a0a", border: "1px solid #ff444444", borderRadius: 16, padding: 24, maxWidth: 320, width: "100%" }} onClick={e => e.stopPropagation()}>
            <p style={{ color: "#ccc", fontFamily: "'Lexend', sans-serif", fontSize: 14, margin: "0 0 18px", lineHeight: 1.5 }}>
              Remove <strong style={{ color: "#fff" }}>{inventory.find(i => i.id === confirmDelete)?.name}</strong> from your wardrobe?
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { deleteItem(confirmDelete); setConfirmDelete(null); }}
                style={{ ...primaryBtn, background: "#ff4444" }}>Remove</button>
              <button onClick={() => setConfirmDelete(null)} style={secondaryBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
