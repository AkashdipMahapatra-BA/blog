"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { create, insert, search as oramaSearch, Orama } from "@orama/orama";
import { Search, X } from "lucide-react";
import Link from "next/link";
import type { PostMeta } from "@/lib/types";

interface SearchBarProps {
  posts: PostMeta[];
}

interface SearchResult {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  publishedAt: string;
  readingTime: string;
}

// Build Orama index from posts — weighted: title > tags > description
async function buildIndex(posts: PostMeta[]) {
  const db = await create({
    schema: {
      slug: "string",
      title: "string",
      description: "string",
      tags: "string",
      publishedAt: "string",
      readingTime: "string",
    },
  });

  for (const post of posts) {
    await insert(db, {
      slug: post.slug,
      title: post.title,
      description: post.description,
      tags: post.tags.join(" "),
      publishedAt: post.publishedAt,
      readingTime: post.readingTime,
    });
  }

  return db;
}

export function SearchBar({ posts }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isIndexing, setIsIndexing] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbRef = useRef<Orama<any> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Build index on mount
  useEffect(() => {
    buildIndex(posts).then((db) => {
      dbRef.current = db;
      setIsIndexing(false);
    });
  }, [posts]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Search handler — fuzzy + multi-field, meaning-aware via boost
  const handleSearch = useCallback(
    async (q: string) => {
      setQuery(q);
      if (!q.trim() || !dbRef.current) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      try {
        const raw = await oramaSearch(dbRef.current, {
          term: q,
          properties: ["title", "tags", "description"],
          boost: {
            title: 3,      // title matches score 3×
            tags: 2,       // tag matches score 2×
            description: 1,
          },
          tolerance: 1,   // fuzzy: 1 typo allowed
          limit: 8,
        });

        const hits: SearchResult[] = (raw.hits ?? []).map((h) => ({
          slug: h.document.slug as string,
          title: h.document.title as string,
          description: h.document.description as string,
          tags: (h.document.tags as string).split(" ").filter(Boolean),
          publishedAt: h.document.publishedAt as string,
          readingTime: h.document.readingTime as string,
        }));

        setResults(hits);
        setIsOpen(hits.length > 0);
      } catch {
        setResults([]);
        setIsOpen(false);
      }
    },
    []
  );

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div
      ref={wrapperRef}
      style={{ position: "relative", width: "100%", maxWidth: "36rem" }}
    >
      {/* ── Search Input — conic-gradient rainbow border (Gemini-style) ── */}
      <div
        className="search-border-glow"
        style={{ boxShadow: isOpen ? "0 0 0 4px var(--accent-subtle)" : undefined }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            background: "var(--bg-surface)",
            borderRadius: "0.65rem",
            padding: "0.65rem 1rem",
            position: "relative",
            zIndex: 1,
          }}
          onClick={() => inputRef.current?.focus()}
        >
          <Search
            size={16}
            style={{ color: "var(--text-muted)", flexShrink: 0 }}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder={
              isIndexing
                ? "Building search index..."
                : "Search by meaning, not just keywords..."
            }
            disabled={isIndexing}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: "0.92rem",
              fontFamily: "inherit",
            }}
            aria-label="Search blog posts"
            aria-expanded={isOpen}
            aria-autocomplete="list"
            role="combobox"
          />
          {query && (
            <button
              onClick={clearSearch}
              aria-label="Clear search"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                display: "flex",
                padding: "0.1rem",
                borderRadius: "0.25rem",
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── Results Dropdown ────────────────────────────── */}
      {isOpen && results.length > 0 && (
        <div
          role="listbox"
          aria-label="Search results"
          style={{
            position: "absolute",
            top: "calc(100% + 0.5rem)",
            left: 0,
            right: 0,
            background: "var(--bg-surface)",
            border: "1px solid var(--border-strong)",
            borderRadius: "0.75rem",
            boxShadow: "var(--shadow-lg)",
            zIndex: 1000,
            overflow: "hidden",
            animation: "searchDropIn 0.18s ease forwards",
          }}
        >
          <style>{`
            @keyframes searchDropIn {
              from { opacity: 0; transform: translateY(-6px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          <div
            style={{
              padding: "0.4rem 0.75rem",
              fontSize: "0.72rem",
              color: "var(--text-muted)",
              borderBottom: "1px solid var(--border-subtle)",
              fontFamily: "ui-monospace, monospace",
              letterSpacing: "0.04em",
            }}
          >
            {results.length} result{results.length !== 1 ? "s" : ""}
          </div>

          {results.map((result) => (
            <Link
              key={result.slug}
              href={`/${result.slug}/`}
              role="option"
              onClick={() => {
                setIsOpen(false);
                setQuery("");
              }}
              style={{
                display: "block",
                padding: "0.9rem 1rem",
                borderBottom: "1px solid var(--border-subtle)",
                textDecoration: "none",
                transition: "background 0.12s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "var(--bg-surface-secondary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              }}
            >
              <div
                style={{
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: "0.25rem",
                  lineHeight: 1.3,
                }}
              >
                {result.title}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.4,
                  marginBottom: "0.4rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {result.description}
              </div>
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                {result.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "0.68rem",
                      padding: "0.1rem 0.4rem",
                      borderRadius: "0.2rem",
                      background: "var(--accent-subtle)",
                      color: "var(--accent)",
                      fontWeight: 500,
                    }}
                  >
                    #{tag}
                  </span>
                ))}
                <span
                  style={{
                    fontSize: "0.68rem",
                    color: "var(--text-muted)",
                    marginLeft: "auto",
                    fontFamily: "ui-monospace, monospace",
                  }}
                >
                  {result.readingTime}
                </span>
              </div>
            </Link>
          ))}

          {/* No-results hint */}
          <div
            style={{
              padding: "0.6rem 1rem",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              fontStyle: "italic",
            }}
          >
            Tip: search by concept — "schema conflict", "DLQ", "cold start", "replication lag"
          </div>
        </div>
      )}

      {/* ── Zero results message ─────────────────────────── */}
      {isOpen && query && results.length === 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 0.5rem)",
            left: 0,
            right: 0,
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "0.75rem",
            boxShadow: "var(--shadow-md)",
            padding: "1rem",
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            zIndex: 1000,
          }}
        >
          No posts matched <strong>"{query}"</strong> — try different terms.
        </div>
      )}
    </div>
  );
}
