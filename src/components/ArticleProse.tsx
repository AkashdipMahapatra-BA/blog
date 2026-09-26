"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bookmark, BookmarkCheck } from "lucide-react";

interface ArticleProseProps {
  htmlContent: string;
  slug: string;
}

// Injected by posts.ts wherever <!-- checkpoint --> appears in the markdown
const SPLIT_MARKER = '<div class="article-checkpoint"></div>';

// ─── Resume banner ─────────────────────────────────────────────────────────────
// Shown at the top of the prose when localStorage holds a saved section index.
function ResumeBanner({
  onResume,
  onDismiss,
}: {
  onResume: () => void;
  onDismiss: () => void;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        padding: "0.85rem 1.25rem",
        background: "var(--accent-subtle)",
        border: "1px solid var(--accent)",
        borderRadius: "0.65rem",
        marginBottom: "1.75rem",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", fontSize: "0.88rem", color: "var(--text-primary)" }}>
        <BookmarkCheck size={16} style={{ color: "var(--accent)", flexShrink: 0 }} />
        <span>You saved your reading progress here last time.</span>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
        <button
          onClick={onResume}
          style={{ padding: "0.4rem 0.9rem", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "0.4rem", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
        >
          Continue reading ↓
        </button>
        <button
          onClick={onDismiss}
          style={{ padding: "0.4rem 0.65rem", background: "none", color: "var(--text-muted)", border: "1px solid var(--border-subtle)", borderRadius: "0.4rem", fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit" }}
        >
          Start over
        </button>
      </div>
    </div>
  );
}

// ─── Checkpoint button ──────────────────────────────────────────────────────────
// Sits on a decorative rule between major sections. Saves position to localStorage
// then navigates home so the user can browse other posts. The subtext explains what
// will happen when they return — visible immediately so nothing is a surprise.
function CheckpointButton({ onSaveAndGo }: { onSaveAndGo: () => void }) {
  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.55rem", padding: "2rem 1rem", margin: "0.5rem 0" }}>
      <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "var(--border-subtle)" }} />
      <button
        onClick={onSaveAndGo}
        style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: "0.45rem", padding: "0.6rem 1.35rem", background: "var(--bg-surface)", border: "1px solid var(--border-strong)", borderRadius: "9999px", color: "var(--text-secondary)", fontSize: "0.83rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", boxShadow: "var(--shadow-sm)", transition: "all 0.18s ease" }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "var(--accent-subtle)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "var(--bg-surface)"; }}
        aria-label="Save reading progress and browse other notes"
      >
        <Bookmark size={14} />
        Save progress · Browse other notes →
      </button>
      <span style={{ position: "relative", fontSize: "0.72rem", color: "var(--text-muted)", fontStyle: "italic", textAlign: "center", padding: "0 0.5rem", background: "var(--bg-primary)" }}>
        When you return to this post, reading continues from this section
      </span>
    </div>
  );
}

// ─── Bottom back navigation ─────────────────────────────────────────────────────
// Shown after the last section so a reader who finishes doesn't have to scroll
// back to the top. Clearing progress here is intentional: they finished the post.
function BottomNav({ onFinish }: { onFinish: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", padding: "2.25rem 1rem 1rem", borderTop: "1px solid var(--border-subtle)", marginTop: "1rem", textAlign: "center" }}>
      <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: 0 }}>
        You&apos;ve reached the end. Explore more engineering notes.
      </p>
      <Link
        href="/"
        onClick={onFinish}
        style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.65rem 1.5rem", background: "var(--bg-surface)", border: "1px solid var(--border-strong)", borderRadius: "0.65rem", color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: 600, textDecoration: "none", boxShadow: "var(--shadow-sm)", transition: "all 0.15s ease" }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "var(--accent-subtle)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "var(--bg-surface)"; }}
      >
        <ArrowLeft size={16} />
        More Engineering Notes
      </Link>
    </div>
  );
}

// ─── Main export ────────────────────────────────────────────────────────────────
export function ArticleProse({ htmlContent, slug }: ArticleProseProps) {
  const router = useRouter();
  const storageKey = `progress:${slug}`;
  const sections = htmlContent.split(SPLIT_MARKER);

  const [resumeIndex, setResumeIndex] = useState<number | null>(null);

  // Check localStorage on mount only — avoids hydration mismatch
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === null) return;
      const idx = parseInt(saved, 10);
      if (!isNaN(idx) && idx >= 0 && idx < sections.length - 1) {
        setResumeIndex(idx);
      }
    } catch { /* localStorage blocked (e.g. private browsing) — fail silently */ }
  }, [storageKey, sections.length]);

  const handleResume = useCallback(() => {
    if (resumeIndex === null) return;
    // Scroll to the anchor placed at the top of the section that follows the checkpoint
    document.getElementById(`section-start-${resumeIndex + 1}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setResumeIndex(null);
  }, [resumeIndex]);

  const handleDismiss = useCallback(() => {
    try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
    setResumeIndex(null);
  }, [storageKey]);

  // Save the checkpoint index then navigate to the home page
  const handleSaveAndGo = useCallback((checkpointIndex: number) => {
    try { localStorage.setItem(storageKey, String(checkpointIndex)); } catch { /* ignore */ }
    router.push("/");
  }, [storageKey, router]);

  // Called when the reader reaches the end and clicks "More Engineering Notes"
  const handleFinish = useCallback(() => {
    try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
  }, [storageKey]);

  return (
    <div>
      {resumeIndex !== null && (
        <ResumeBanner onResume={handleResume} onDismiss={handleDismiss} />
      )}

      {sections.map((section, idx) => (
        <div key={idx}>
          {/* Invisible scroll anchor — resume jumps here so the reader lands at the
              start of the section that follows a checkpoint, not at the button itself */}
          {idx > 0 && (
            <div id={`section-start-${idx}`} style={{ scrollMarginTop: "5.5rem" }} aria-hidden="true" />
          )}

          <div
            className="prose"
            style={{
              paddingTop: idx === 0 ? "2.5rem" : "1.5rem",
              paddingBottom: 0,
            }}
            dangerouslySetInnerHTML={{ __html: section }}
          />

          {idx < sections.length - 1 && (
            <CheckpointButton onSaveAndGo={() => handleSaveAndGo(idx)} />
          )}
        </div>
      ))}

      <BottomNav onFinish={handleFinish} />
    </div>
  );
}
