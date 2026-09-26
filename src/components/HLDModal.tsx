"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

// ─── Colour palette for flow boxes ───────────────────────────────────────────
type BoxColor = "blue" | "violet" | "green" | "amber" | "cyan";

const palette: Record<BoxColor, { bg: string; border: string; text: string }> = {
  blue:   { bg: "rgba(37,99,235,0.07)",   border: "rgba(37,99,235,0.22)",   text: "#2563EB" },
  violet: { bg: "rgba(139,92,246,0.07)",  border: "rgba(139,92,246,0.22)",  text: "#7C3AED" },
  green:  { bg: "rgba(16,185,129,0.07)",  border: "rgba(16,185,129,0.22)",  text: "#059669" },
  amber:  { bg: "rgba(245,158,11,0.07)",  border: "rgba(245,158,11,0.22)",  text: "#D97706" },
  cyan:   { bg: "rgba(6,182,212,0.07)",   border: "rgba(6,182,212,0.22)",   text: "#0891B2" },
};

// ─── Diagram primitives ───────────────────────────────────────────────────────
function FlowBox({ label, sub, color }: { label: string; sub: string; color: BoxColor }) {
  const c = palette[color];
  return (
    <div style={{
      flex: "1 1 0",
      minWidth: "7rem",
      padding: "0.5rem 0.7rem",
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: "0.45rem",
    }}>
      <div style={{ fontWeight: 700, color: c.text, fontSize: "0.78rem", lineHeight: 1.3 }}>
        {label}
      </div>
      <div style={{ color: "var(--text-muted)", fontSize: "0.67rem", marginTop: "0.15rem", lineHeight: 1.4 }}>
        {sub}
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <span className="hld-flow-arrow" style={{ color: "var(--text-muted)", fontSize: "0.9rem", flexShrink: 0 }}>──►</span>
  );
}

function Pipeline({ step, label, children }: { step: string; label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <div style={{
        fontSize: "0.66rem",
        fontWeight: 700,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color: "var(--text-muted)",
        marginBottom: "0.45rem",
        fontFamily: "ui-monospace, monospace",
      }}>
        {step} — {label}
      </div>
      <div
        className="hld-pipeline-row"
        style={{
          background: "var(--bg-surface-secondary)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "0.55rem",
          padding: "0.75rem 0.85rem",
          display: "flex",
          alignItems: "center",
          gap: "0.45rem",
          flexWrap: "wrap",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Main diagram — 4 pipelines + comparison ────────────────────────────────
function ArchDiagram() {
  return (
    <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>

      <Pipeline step="①" label="Content Pipeline · Build Time">
        <FlowBox label="MDX Files"      sub="/content/posts/"    color="blue"   />
        <FlowArrow />
        <FlowBox label="Next.js SSG"    sub="npm run build"      color="violet" />
        <FlowArrow />
        <FlowBox label="Static Bundle"  sub="/out/ (CDN-ready)"  color="green"  />
      </Pipeline>

      <Pipeline step="②" label="Deploy · CI / CD">
        <FlowBox label="git push main"    sub="local commit"           color="amber"  />
        <FlowArrow />
        <FlowBox label="GitHub Actions"   sub=".github/workflows/"     color="violet" />
        <FlowArrow />
        <FlowBox label="GitHub Pages"     sub="global CDN edge nodes"  color="green"  />
      </Pipeline>

      <Pipeline step="③" label="Request Lifecycle · Zero Backend">
        <FlowBox label="Visitor"         sub="any browser"    color="blue"  />
        <FlowArrow />
        <FlowBox label="CDN Edge Node"   sub="~10 ms TTFB"    color="green" />
        <FlowArrow />
        <FlowBox label="React Hydrates"  sub="SPA in browser" color="cyan"  />
      </Pipeline>

      <Pipeline step="④" label="Semantic Search · 100 % In-Browser">
        <FlowBox label="User types"      sub="any keystroke"         color="blue"  />
        <FlowArrow />
        <FlowBox label="Orama Engine"    sub="fuzzy + field boost"   color="cyan"  />
        <FlowArrow />
        <FlowBox label="Ranked Results"  sub="title×3 · tag×2 · desc×1" color="green" />
      </Pipeline>

      {/* Why-not comparison ─────────────────────────────────────────────── */}
      <div style={{
        padding: "0.9rem 1rem",
        background: "var(--bg-surface-secondary)",
        border: "1px dashed var(--border-strong)",
        borderRadius: "0.55rem",
        fontSize: "0.75rem",
        lineHeight: 1.65,
        color: "var(--text-secondary)",
      }}>
        <div style={{
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: "0.55rem",
          fontSize: "0.78rem",
        }}>
          Why not Qdrant / Pinecone / Neo4j?
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "0.25rem 0.8rem",
          alignItems: "start",
        }}>
          <span style={{ color: "#F59E0B", fontWeight: 700, whiteSpace: "nowrap" }}>
            Qdrant / Pinecone
          </span>
          <span>
            Vector API server required. GitHub Pages has no server runtime — adding one
            costs $10–70/mo plus an ingestion pipeline for a personal blog with &lt;100 posts.
          </span>
          <span style={{ color: "#F59E0B", fontWeight: 700, whiteSpace: "nowrap" }}>
            Neo4j
          </span>
          <span>
            Graph traversal is powerful for relation queries, not fuzzy full-text ranking.
            Still needs a server. Incompatible with static export.
          </span>
          <span style={{ color: "#10B981", fontWeight: 700, whiteSpace: "nowrap" }}>
            Orama ✅
          </span>
          <span>
            Pure browser runtime — no API calls, no infrastructure, no cost. Fuzzy match,
            field-weight boosting, instant results at every keystroke.
          </span>
        </div>
      </div>

    </div>
  );
}

// ─── Public component — button + modal ──────────────────────────────────────
export function HLDModal() {
  const [open, setOpen] = useState(false);

  // Lock body scroll while modal is visible
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Always-rendered styles: keyframes + mobile responsive override.
          !important is needed here because the pipeline uses inline flex styles
          that have higher specificity than class selectors. */}
      <style>{`
        @keyframes hldFadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes hldSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 580px) {
          .hld-pipeline-row { flex-direction: column !important; align-items: stretch !important; }
          .hld-flow-arrow   { display: none !important; }
        }
      `}</style>

      {/* ── Trigger button — sits beside the search bar ──────────────── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="View blog architecture high-level design"
        style={{
          flexShrink: 0,
          display: "inline-flex",
          alignItems: "center",
          gap: "0.3rem",
          padding: "0.65rem 0.85rem",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "0.65rem",
          color: "var(--text-secondary)",
          fontSize: "0.82rem",
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
          boxShadow: "var(--shadow-sm)",
          fontFamily: "inherit",
          transition: "border-color 0.15s ease, color 0.15s ease, background 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--accent)";
          e.currentTarget.style.color       = "var(--accent)";
          e.currentTarget.style.background  = "var(--accent-subtle)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border-strong)";
          e.currentTarget.style.color       = "var(--text-secondary)";
          e.currentTarget.style.background  = "var(--bg-surface)";
        }}
      >
        HLD <span aria-hidden="true" style={{ fontSize: "0.88rem" }}>↗</span>
      </button>

      {/* ── Modal overlay ─────────────────────────────────────────────── */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Blog architecture high-level design"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            animation: "hldFadeIn 0.15s ease",
          }}
        >
          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-strong)",
              borderRadius: "1rem",
              padding: "1.75rem",
              maxWidth: "680px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              position: "relative",
              animation: "hldSlideUp 0.2s ease",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close architecture diagram"
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "1px solid var(--border-subtle)",
                borderRadius: "0.4rem",
                cursor: "pointer",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "1.9rem",
                height: "1.9rem",
                fontFamily: "inherit",
                transition: "border-color 0.15s ease",
              }}
            >
              <X size={14} />
            </button>

            {/* Header */}
            <h2 style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "0.2rem",
              fontFamily: "inherit",
            }}>
              Blog Architecture — HLD
            </h2>
            <p style={{
              fontSize: "0.74rem",
              color: "var(--text-muted)",
              marginBottom: "1.5rem",
              fontFamily: "ui-monospace, monospace",
              letterSpacing: "0.02em",
            }}>
              Static-first · Zero server · In-browser semantic search · GitHub Pages CDN
            </p>

            <ArchDiagram />
          </div>
        </div>
      )}
    </>
  );
}
