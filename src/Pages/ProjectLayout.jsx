// PlotMap.jsx
import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  ImageOverlay,
  Polygon,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import LAYOUT_IMAGE from "../Assests/map.jpeg"

// ─── YOUR LOCATION: 21.0997253, 79.1803557 (Nagpur, MH) ────────────────────

// ── Step 1: Replace this with your actual layout image path ─────────────────
// const LAYOUT_IMAGE = "../"; // or a hosted URL

// ── Step 2: Set these to the SW and NE corners of your layout image ─────────
//    Use the CoordLogger below — click map corners to get exact values
const LAYOUT_BOUNDS = [
  [21.097851, 79.178604], // SW corner (bottom-left of your image)
  [21.098209, 79.180111], // NE corner (top-right of your image)
  [21.099654, 79.180357], // NE corner (top-right of your image)
  [21.099759, 79.178860], // NE corner (top-right of your image)
//   [21.098238, 79.179370], // NE corner (top-right of your image)
];

// ── Step 3: Define your plots with real coordinates ─────────────────────────
//    Use CoordLogger to trace each plot boundary by clicking corners
const PLOTS = [
  {
    id: "A-01", label: "Plot A-01", area: "450 sq.m",
    zone: "Residential", owner: "N/A", price: "₹18,00,000",
    status: "Available",
    coords: [
      [21.09965, 79.17995],
      [21.09965, 79.18020],
      [21.09950, 79.18020],
      [21.09950, 79.17995],
    ],
  },
  {
    id: "A-02", label: "Plot A-02", area: "480 sq.m",
    zone: "Residential", owner: "Suresh Raut", price: "₹19,20,000",
    status: "Sold",
    coords: [
      [21.09965, 79.18025],
      [21.09965, 79.18050],
      [21.09950, 79.18050],
      [21.09950, 79.18025],
    ],
  },
  {
    id: "B-01", label: "Plot B-01", area: "520 sq.m",
    zone: "Commercial", owner: "Priya Deshmukh", price: "₹26,00,000",
    status: "Reserved",
    coords: [
      [21.09948, 79.17995],
      [21.09948, 79.18025],
      [21.09930, 79.18025],
      [21.09930, 79.17995],
    ],
  },
  {
    id: "B-02", label: "Plot B-02", area: "390 sq.m",
    zone: "Residential", owner: "N/A", price: "₹15,60,000",
    status: "Available",
    coords: [
      [21.09948, 79.18030],
      [21.09948, 79.18060],
      [21.09930, 79.18060],
      [21.09930, 79.18030],
    ],
  },
  {
    id: "C-01", label: "Plot C-01", area: "610 sq.m",
    zone: "Corner Plot", owner: "N/A", price: "₹30,50,000",
    status: "Available",
    coords: [
      [21.09928, 79.17990],
      [21.09928, 79.18030],
      [21.09905, 79.18030],
      [21.09905, 79.17990],
    ],
  },
];

// ── Status styling ───────────────────────────────────────────────────────────
const STATUS = {
  Available: { color: "#16a34a", bg: "#dcfce7", text: "#15803d" },
  Sold:      { color: "#dc2626", bg: "#fee2e2", text: "#b91c1c" },
  Reserved:  { color: "#d97706", bg: "#fef3c7", text: "#b45309" },
};

// ── Coord logger – click map to log lat/lng for tracing plots ────────────────
function CoordLogger({ active, onCoord }) {
  useMapEvents({
    click(e) {
      if (active) onCoord([
        parseFloat(e.latlng.lat.toFixed(6)),
        parseFloat(e.latlng.lng.toFixed(6))
      ]);
    },
  });
  return null;
}

// ── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ plot, onClose }) {
  if (!plot) return null;
  const s = STATUS[plot.status];
  return (
    <div style={{
      position: "absolute", top: 16, right: 16, zIndex: 1000,
      background: "#fff", borderRadius: 12,
      boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      padding: "20px 22px", width: 268,
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#111" }}>{plot.label}</div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>ID: {plot.id}</div>
        </div>
        <button onClick={onClose} style={{
          border: "none", background: "none", fontSize: 20,
          cursor: "pointer", color: "#aaa", lineHeight: 1, padding: 0,
        }}>×</button>
      </div>

      <span style={{
        display: "inline-block", marginTop: 10, padding: "3px 12px",
        borderRadius: 20, background: s.bg, color: s.text,
        fontSize: 12, fontWeight: 600,
      }}>{plot.status}</span>

      <hr style={{ margin: "14px 0", borderColor: "#f0f0f0", borderWidth: "0 0 1px" }} />

      {[
        ["Area",  plot.area],
        ["Zone",  plot.zone],
        ["Price", plot.price],
        ["Owner", plot.owner],
      ].map(([k, v]) => (
        <div key={k} style={{
          display: "flex", justifyContent: "space-between",
          fontSize: 13, marginBottom: 8,
        }}>
          <span style={{ color: "#888" }}>{k}</span>
          <span style={{ fontWeight: 500, color: "#222" }}>{v}</span>
        </div>
      ))}

      {plot.status === "Available" && (
        <button style={{
          marginTop: 12, width: "100%", padding: "9px 0",
          background: "#16a34a", color: "#fff", border: "none",
          borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer",
        }}>
          Enquire Now
        </button>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PlotMap() {
  const [selected, setSelected]       = useState(null);
  const [logMode, setLogMode]         = useState(false);
  const [loggedCoords, setLoggedCoords] = useState([]);
  const [overlayOpacity, setOverlayOpacity] = useState(0.6);

  const addCoord = (c) => setLoggedCoords(p => [...p, c]);

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>

      {/* Toolbar */}
      <div style={{
        position: "absolute", top: 16, left: 16, zIndex: 1000,
        display: "flex", flexDirection: "column", gap: 8,
      }}>
        {/* Opacity slider */}
        <div style={{
          background: "#fff", borderRadius: 8, padding: "8px 12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
          fontFamily: "sans-serif", fontSize: 12,
        }}>
          <div style={{ color: "#666", marginBottom: 4 }}>
            Layout opacity: <strong>{Math.round(overlayOpacity * 100)}%</strong>
          </div>
          <input type="range" min="0" max="100" value={Math.round(overlayOpacity * 100)}
            onChange={e => setOverlayOpacity(e.target.value / 100)}
            style={{ width: 140 }}
          />
        </div>

        {/* Coord logger toggle */}
        <button
          onClick={() => { setLogMode(p => !p); setLoggedCoords([]); }}
          style={{
            background: logMode ? "#1d4ed8" : "#fff",
            color: logMode ? "#fff" : "#333",
            border: "1px solid #ddd", borderRadius: 8,
            padding: "7px 12px", fontSize: 12, cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {logMode ? "🔴 Logging coords…" : "📍 Log coords"}
        </button>

        {/* Logged coords output */}
        {loggedCoords.length > 0 && (
          <div style={{
            background: "#1e293b", color: "#86efac",
            borderRadius: 8, padding: "8px 10px",
            fontSize: 11, fontFamily: "monospace",
            maxHeight: 180, overflowY: "auto",
            boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
          }}>
            {loggedCoords.map((c, i) => (
              <div key={i}>[{c[0]}, {c[1]}],</div>
            ))}
          </div>
        )}
      </div>

      {/* Plot count legend */}
      <div style={{
        position: "absolute", bottom: 24, left: "50%",
        transform: "translateX(-50%)", zIndex: 1000,
        background: "#fff", borderRadius: 30,
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
        padding: "8px 20px", display: "flex", gap: 20,
        fontFamily: "sans-serif", fontSize: 13,
      }}>
        {Object.entries(STATUS).map(([label, s]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: s.color }} />
            <span style={{ color: "#444" }}>{label}</span>
            <strong style={{ color: "#111" }}>
              {PLOTS.filter(p => p.status === label).length}
            </strong>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <Sidebar plot={selected} onClose={() => setSelected(null)} />

      {/* Map */}
      <MapContainer
        center={[21.0997253, 79.1803557]}
        zoom={19}
        minZoom={15}
        maxZoom={22}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Satellite tiles */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxNativeZoom={19}
          maxZoom={22}
        />
        {/* Labels */}
        <TileLayer
          url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          maxNativeZoom={19}
          maxZoom={22}
        />

        {/* Layout image overlay */}
        <ImageOverlay
          url={LAYOUT_IMAGE}
          bounds={LAYOUT_BOUNDS}
          opacity={overlayOpacity}
          zIndex={10}
        />

        {/* Clickable plot polygons */}
        {PLOTS.map((plot) => {
          const s = STATUS[plot.status];
          return (
            <Polygon
              key={plot.id}
              positions={plot.coords}
              pathOptions={{
                color: s.color,
                fillColor: s.color,
                fillOpacity: selected?.id === plot.id ? 0.55 : 0.3,
                weight: selected?.id === plot.id ? 3 : 2,
              }}
              eventHandlers={{
                click: () => setSelected(plot),
                mouseover: (e) => e.target.setStyle({ fillOpacity: 0.5, weight: 3 }),
                mouseout: (e) => e.target.setStyle({
                  fillOpacity: selected?.id === plot.id ? 0.55 : 0.3,
                  weight: selected?.id === plot.id ? 3 : 2,
                }),
              }}
            >
              <Tooltip permanent direction="center" className="plot-label">
                <span style={{ fontSize: 10, fontWeight: 600 }}>{plot.id}</span>
              </Tooltip>
            </Polygon>
          );
        })}

        <CoordLogger active={logMode} onCoord={addCoord} />
      </MapContainer>
    </div>
  );
}