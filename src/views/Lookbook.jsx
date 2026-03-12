import { useState, useCallback, useMemo } from "react";
import { outfits as baseOutfits, categories, categoryColors } from "../data/outfits";

const SwatchDot = ({ color }) => (
  <div style={{ width: 13, height: 13, borderRadius: "50%", background: color, border: "1.5px solid rgba(255,255,255,0.12)", flexShrink: 0 }} />
);

const OutfitCard = ({ outfit, isHighlighted, onClose }) => {
  const tagColor = categoryColors[outfit.category] || "#aaa";
  return (
    <div style={{
      background: isHighlighted
        ? `linear-gradient(145deg, #111118 0%, #0c0c14 100%)`
        : "linear-gradient(145deg, #0a0a0a 0%, #080808 100%)",
      border: isHighlighted ? `1.5px solid ${tagColor}88` : "1px solid #ffffff0e",
      borderRadius: 14,
      padding: "20px 18px",
      position: "relative",
      transition: "all 0.3s ease",
      boxShadow: isHighlighted ? `0 0 40px ${tagColor}22, 0 8px 32px #00000080` : "0 2px 8px #00000050",
    }}>
      {isHighlighted && (
        <button onClick={onClose} style={{
          position: "absolute", top: 10, right: 10, background: "#ffffff18", border: "none",
          borderRadius: 6, color: "#aaa", cursor: "pointer", fontSize: 14, padding: "2px 7px", lineHeight: 1,
        }}>✕</button>
      )}

      <div style={{ position: "absolute", top: 0, left: 0, width: "45%", height: 2,
        background: `linear-gradient(90deg, ${tagColor}, transparent)`, borderRadius: "2px 2px 0 0" }} />

      <div style={{ position: "absolute", top: 12, right: isHighlighted ? 38 : 12,
        fontFamily: "'Courier New', monospace", fontSize: 10, color: "#ffffff99", letterSpacing: 1 }}>
        #{String(outfit.id).padStart(3, "0")}
      </div>

      <div style={{
        display: "inline-block", background: `${tagColor}15`, border: `1px solid ${tagColor}44`,
        borderRadius: 5, padding: "2px 8px", fontSize: 9, fontFamily: "'Courier New', monospace",
        color: tagColor, letterSpacing: 1.5, fontWeight: 700, textTransform: "uppercase", marginBottom: 8,
      }}>{outfit.category}</div>

      <h3 style={{ margin: "0 0 3px", fontSize: 16, fontFamily: "'Lexend', sans-serif", fontWeight: 700, color: "#eeeeff", lineHeight: 1.2 }}>
        {outfit.name}
      </h3>
      <p style={{ margin: "0 0 14px", fontSize: 11, color: "#666", fontStyle: "italic", fontFamily: "'Lexend', sans-serif" }}>
        "{outfit.vibe}"
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {[
          { label: "TOP", value: outfit.top },
          ...(outfit.extra ? [{ label: "LAYER", value: outfit.extra }] : []),
          { label: "BOTTOM", value: outfit.bottom },
          { label: "SHOES", value: outfit.shoes },
          { label: "SOCKS", value: outfit.socks },
          ...(outfit.note ? [{ label: "FIT TIP", value: outfit.note, accent: true }] : []),
        ].map(({ label, value, accent }) => (
          <div key={label} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: accent ? "#e8ff4a" : tagColor,
              letterSpacing: 1.5, fontWeight: 700, minWidth: 46, paddingTop: 1, opacity: accent ? 1 : 0.75 }}>{label}</span>
            <span style={{ fontSize: 12, color: accent ? "#e8ff4a99" : "#bbb",
              fontFamily: "'Lexend', sans-serif", lineHeight: 1.4, flex: 1,
              fontStyle: accent ? "italic" : "normal" }}>{value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 5, marginTop: 12, paddingTop: 10, borderTop: "1px solid #ffffff08", alignItems: "center" }}>
        <span style={{ fontSize: 9, color: "#ffffff99", fontFamily: "Courier New", letterSpacing: 1 }}>palette</span>
        {outfit.colors.map((c, i) => <SwatchDot key={i} color={c} />)}
      </div>
    </div>
  );
};

const RandomModal = ({ outfit, onClose, onReroll }) => {
  if (!outfit) return null;
  const tagColor = categoryColors[outfit.category] || "#aaa";
  return (
    <div style={{
      position: "fixed", inset: 0, background: "#00000090", zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      backdropFilter: "blur(6px)",
    }} onClick={onClose}>
      <div style={{
        background: "#0a0a0a", border: `1.5px solid ${tagColor}66`,
        borderRadius: 20, padding: 32, maxWidth: 420, width: "100%",
        boxShadow: `0 0 80px ${tagColor}22, 0 24px 80px #000000cc`,
        position: "relative",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#ffffff", letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>Today's Fit</div>
          <div style={{ fontSize: 28, marginBottom: 4 }}>🎲</div>
          <h2 style={{ margin: 0, fontFamily: "'Lexend', sans-serif", color: "#eeeeff", fontSize: 22 }}>{outfit.name}</h2>
          <p style={{ margin: "4px 0 0", color: "#666", fontStyle: "italic", fontSize: 12, fontFamily: "'Lexend', sans-serif" }}>"{outfit.vibe}"</p>
        </div>

        <div style={{ background: "#050505", borderRadius: 12, padding: "16px 18px", marginBottom: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "TOP", value: outfit.top },
              ...(outfit.extra ? [{ label: "LAYER", value: outfit.extra }] : []),
              { label: "BOTTOM", value: outfit.bottom },
              { label: "SHOES", value: outfit.shoes },
              { label: "SOCKS", value: outfit.socks },
              ...(outfit.note ? [{ label: "FIT TIP", value: outfit.note, accent: true }] : []),
            ].map(({ label, value, accent }) => (
              <div key={label} style={{ display: "flex", gap: 10 }}>
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: accent ? "#e8ff4a" : tagColor,
                  fontWeight: 700, letterSpacing: 1.5, minWidth: 50 }}>{label}</span>
                <span style={{ fontSize: 13, color: accent ? "#e8ff4a88" : "#ccc",
                  fontFamily: "'Lexend', sans-serif", lineHeight: 1.4, fontStyle: accent ? "italic" : "normal" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onReroll} style={{
            flex: 1, background: "#e8ff4a", border: "none", borderRadius: 10, color: "#0a0a0f",
            padding: "12px 0", fontFamily: "'Courier New', monospace", fontWeight: 700,
            fontSize: 12, letterSpacing: 1, cursor: "pointer",
          }}>🎲 REROLL</button>
          <button onClick={onClose} style={{
            flex: 1, background: "#ffffff0f", border: "1px solid #ffffff18", borderRadius: 10,
            color: "#888", padding: "12px 0", fontFamily: "'Courier New', monospace",
            fontSize: 12, letterSpacing: 1, cursor: "pointer",
          }}>CLOSE</button>
        </div>
      </div>
    </div>
  );
};

export default function Lookbook({ customOutfits }) {
  const allOutfits = useMemo(() => [...baseOutfits, ...customOutfits], [customOutfits]);
  const allCategories = ["All", ...categories.slice(1), ...(customOutfits.length ? ["Custom"] : [])];

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [randomOutfit, setRandomOutfit] = useState(null);

  const filtered = allOutfits.filter(o => {
    const matchCat = activeCategory === "All" || o.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || [o.name, o.top, o.bottom, o.shoes, o.category, o.vibe, o.extra || ""].some(v => v.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const rollRandom = useCallback(() => {
    const pool = activeCategory === "All" ? allOutfits : filtered;
    if (!pool.length) return;
    setRandomOutfit(pool[Math.floor(Math.random() * pool.length)]);
  }, [allOutfits, filtered, activeCategory]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#ffffff", letterSpacing: 4, textTransform: "uppercase", marginBottom: 6, opacity: 0.8 }}>
          {filtered.length} of {allOutfits.length} combinations
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: "clamp(28px, 5vw, 52px)", fontFamily: "'Lexend', sans-serif", fontWeight: 700, color: "#f0f0ff", letterSpacing: "-1.5px", lineHeight: 1 }}>
            THE LOOKBOOK
          </h1>
          <button onClick={rollRandom} style={{
            background: "linear-gradient(135deg, #e8ff4a, #b8cc20)",
            border: "none", borderRadius: 12, color: "#0a0a0f",
            padding: "12px 24px", fontFamily: "'Courier New', monospace",
            fontWeight: 700, fontSize: 13, letterSpacing: 1, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 4px 20px #e8ff4a30",
            transition: "transform 0.15s",
          }} onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
             onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}>
            🎲 Random Fit
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search shoes, tops, vibes..."
          style={{
            width: "100%", boxSizing: "border-box",
            background: "#0a0a0a", border: "1px solid #ffffff12",
            borderRadius: 10, padding: "10px 16px", color: "#e8e8f0",
            fontSize: 14, fontFamily: "'Lexend', sans-serif",
            outline: "none",
          }}
        />
      </div>

      {/* Category Filter */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 28 }}>
        {allCategories.map(cat => {
          const color = cat === "All" ? "#ffffff" : (categoryColors[cat] || "#888");
          const active = activeCategory === cat;
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              background: active ? `${color}18` : "transparent",
              border: `1px solid ${active ? color + "55" : "#ffffff12"}`,
              borderRadius: 7, color: active ? color : "#666",
              padding: "5px 12px", fontSize: 11, cursor: "pointer",
              fontFamily: "'Courier New', monospace", letterSpacing: 0.8,
              transition: "all 0.15s",
            }}>{cat}</button>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {filtered.map((outfit, i) => (
          <OutfitCard key={outfit.id || i} outfit={outfit} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#444", fontFamily: "'Lexend', sans-serif", fontSize: 15 }}>
          No outfits match your search.
        </div>
      )}

      <RandomModal
        outfit={randomOutfit}
        onClose={() => setRandomOutfit(null)}
        onReroll={rollRandom}
      />
    </div>
  );
}
