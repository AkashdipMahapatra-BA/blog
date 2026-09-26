# Blog Authoring Guide — Akashdip Mahapatra Engineering Blog

> **A note to the reader:** This document lives in `content/docs/` rather than the project root intentionally.
> It is a living style guide for anyone (human or AI assistant) who contributes to this blog.
> If you found this while browsing the repository, welcome — read on for how this site works.

---

## 1. About This Repository

**Site URL:** `https://blog.akashdipmahapatra.in`
**Stack:** Next.js 15 (static export), React 19, TypeScript, gray-matter, marked, Orama search
**Deployment:** GitHub Pages via `out/` static export — no server runtime
**Author:** Akashdip Mahapatra — Data Engineer & Cloud Automation Specialist | SRE at British Airways

This is a technical engineering blog. Every post is a deep-dive into real production problems, architecture decisions, or incident post-mortems. It is not a tutorial site — it is a practitioner's notebook made public.

---

## 2. Repository Structure

```
blog.akashdipmahapatra.in/
├── content/
│   ├── posts/              ← All blog posts live here as .md files
│   └── docs/               ← This guide (not rendered on site)
├── src/
│   ├── app/
│   │   ├── layout.tsx      ← Root layout: Header + Footer + theme script
│   │   ├── page.tsx        ← Home page: lists all posts, search bar
│   │   ├── globals.css     ← ALL styles — single CSS file, CSS custom properties
│   │   └── [slug]/
│   │       └── page.tsx    ← Individual post page
│   ├── components/
│   │   ├── Header.tsx      ← Site header with Portfolio link + ThemeToggle
│   │   ├── Footer.tsx      ← Footer with GitHub, LinkedIn, Portfolio links
│   │   ├── SearchBar.tsx   ← Client-side Orama semantic search component
│   │   ├── SplitGithubButton.tsx  ← Hover-reveal dual GitHub link button
│   │   └── ThemeToggle.tsx ← Light/dark toggle (localStorage persisted)
│   └── lib/
│       ├── posts.ts        ← File system post loader, sorted by date desc
│       └── types.ts        ← TypeScript interfaces (PostMeta, Post)
├── public/
│   ├── akashdip.jpg        ← Author photo (used in hero + author card)
│   ├── CNAME               ← blog.akashdipmahapatra.in
│   └── robots.txt
├── scripts/
│   └── new-post.js         ← CLI helper: `npm run new-post "Your Title Here"`
├── next.config.mjs         ← output: 'export', trailingSlash: true
└── package.json
```

---

## 3. How to Create a New Blog Post

### Option A — CLI (recommended)
```bash
npm run new-post "Your Post Title Here"
```
This creates `content/posts/your-post-title-here.md` with the correct frontmatter template.

### Option B — Manual
Create a `.md` file in `content/posts/`. The filename becomes the URL slug if no `slug` field is set in frontmatter.

---

## 4. Frontmatter Schema (Required Fields)

Every post **must** start with YAML frontmatter between `---` delimiters.

```yaml
---
title: "Your Full Post Title Here"
slug: "your-url-slug-no-spaces"
description: "One or two sentences. Shown in post cards and used for SEO meta description."
publishedAt: "YYYY-MM-DD"
author: "Akashdip Mahapatra"
authorRole: "Data Engineer & Cloud Automation Specialist | SRE"
authorAvatar: "/akashdip.jpg"
tags: ["System Design", "AWS", "Kafka"]
readingTime: "N min read"
featured: false
---
```

**Field rules:**
- `title` — Full sentence case, descriptive, no clickbait. Should reflect the technical problem solved.
- `slug` — Lowercase, hyphen-separated, no special characters. Must be unique across all posts.
- `description` — 1–2 sentences max. Written for a senior engineer audience. Avoid phrases like "In this post" or "Learn how".
- `publishedAt` — ISO date `YYYY-MM-DD`. Controls sort order on home page (newest first).
- `tags` — Array of strings. Use existing tags from other posts for consistency. Common tags: `System Design`, `AWS`, `Kafka`, `SRE`, `Architecture`, `Post-Mortem`, `DevOps`, `Data Engineering`, `Streaming`, `CDC`, `MSK`.
- `readingTime` — Estimate manually or let the system calculate it (if omitted, auto-calculated at ~200 wpm).
- `featured` — `true` marks the post as featured; currently shows a "FEATURED" badge. Use sparingly (one at a time max).

---

## 5. Writing Style

### Tone
- Write as a **practitioner writing to other practitioners**. Assume the reader knows what Kafka is. Do not explain basics.
- Prefer **active voice** and **specific numbers**: "reduced p99 latency from 340ms to 47ms" beats "significantly improved performance".
- Use **"we"** when describing team decisions, **"I"** when describing personal observations or lessons.

### Structure Template (standard for this blog)
```
## Executive Overview          ← 2-3 paragraph summary of the problem and outcome
## The Problem & Constraints   ← What failed / what needed to scale / why it mattered
## Architecture & Design       ← The solution, with ASCII diagrams
## Implementation Details      ← Code snippets, config examples, command sequences
## Production Results          ← Metrics before/after, real numbers
## Post-Mortem / Lessons Learned  ← What surprised us, what we'd do differently
---
(optional: ## Further Reading)
```

You do not need to follow this exactly — adapt to the post's natural structure. A post-mortem has different flow than an architecture deep-dive.

### ASCII Architecture Diagrams
Always prefer ASCII diagrams inside code blocks for architecture flows. They render correctly in both light and dark themes, and are copy-pasteable.

```
[Producer] ──► [MSK Topic] ──► [Lambda Processor] ──► [DynamoDB]
                    │
                    └──► [DLQ Topic] ──► [CloudWatch Alert]
```

Use `──►` for data flow arrows. Use `│`, `├`, `└` for tree structures.

### Code Blocks
Always specify the language for syntax highlighting:
````md
```python
def process_event(event: dict) -> None:
    ...
```

```yaml
# Kafka consumer config
max.poll.records: 500
auto.offset.reset: earliest
```

```bash
aws kafka describe-cluster --cluster-arn arn:aws:kafka:...
```
````

### Headings
- Use `##` for main sections (renders as H2 with a bottom border in the prose style)
- Use `###` for subsections (H3)
- Avoid H1 inside posts — the post title is already rendered as H1 by the page template
- Keep headings specific: "Schema Registry Conflict at 3am" beats "Problem"

### Tables
Use Markdown tables for comparison data — they render with full styling (borders, alternating row shading):
```md
| Service     | Throughput | Latency P99 | Cost/month |
|-------------|-----------|-------------|-----------|
| AWS MSK     | 800k/s    | 12ms        | £180      |
| Confluent   | 1.2M/s    | 8ms         | £600      |
```

### Callout Blockquotes
Use `>` for important callouts or key insights:
```md
> **Production insight:** Never rely on `auto.create.topics.enable = true` in a schema-governed pipeline.
> Always pre-provision topics with explicit partition counts and retention policies.
```

---

## 6. Design System

All styles live in `src/app/globals.css`. **Do not add inline styles or Tailwind** — use only CSS custom properties and the existing class system.

### CSS Custom Properties (Design Tokens)

| Token | Light | Dark |
|---|---|---|
| `--bg-primary` | `#FAF9F6` | `#0F172A` |
| `--bg-surface` | `#FFFFFF` | `#1E293B` |
| `--text-primary` | `#0F172A` | `#F8FAFC` |
| `--text-secondary` | `#475569` | `#CBD5E1` |
| `--text-muted` | `#64748B` | `#94A3B8` |
| `--accent` | `#2563EB` | `#06B6D4` |

### Key CSS Classes

| Class | Used for |
|---|---|
| `.container` | Max-width 896px centred layout wrapper |
| `.post-card` | Home page article card with hover lift |
| `.tag-badge` | Inline tag pill (e.g., `#Kafka`) |
| `.read-more-link` | Animated arrow link at card bottom |
| `.prose` | Markdown content container with full typography styles |
| `.article-header` | Full-width post title + meta bar area |
| `.article-author-card` | Author bio box at post bottom |
| `.hero-section` | Home page header area |
| `.filter-bar` | Tag filter pill row |

When adding new UI, always add CSS variables to both `:root` (light) and `[data-theme="dark"]` blocks.

---

## 7. Theming

The blog defaults to **light theme** (as stored in `<html data-theme="light">`). Users can toggle to dark via the `ThemeToggle` button. The preference is persisted in `localStorage` under the key `"theme"`.

The theme-init script in `layout.tsx` reads from localStorage and applies the correct `data-theme` attribute before paint to prevent FOUC (flash of unstyled content).

> **Important:** The Portfolio site (`akashdipmahapatra.in`) is dark-theme by default. The blog is intentionally light-theme by default for high print-contrast and readability of code blocks and tables.

---

## 8. Author Information (Do Not Change)

```
Name:       Akashdip Mahapatra
Role:       Data Engineer & Cloud Automation Specialist | SRE
Avatar:     /akashdip.jpg
Portfolio:  https://akashdipmahapatra.in
LinkedIn:   https://www.linkedin.com/in/akashdip2001
GitHub Work:     https://github.com/AkashdipMahapatra-BA
GitHub Academic: https://github.com/akashdip2001
```

These values are defaults in `src/lib/posts.ts`. They should appear exactly as above in every post frontmatter.

---

## 9. Deployment

1. Write your post in `content/posts/`.
2. Run `npm run build` locally to verify no build errors.
3. Commit and push to `main`.
4. GitHub Actions automatically runs `next build` → publishes `out/` to GitHub Pages.

The site uses `trailingSlash: true` and `output: 'export'` — every page is a static HTML file. There is no server. No API routes work at runtime.

---

## 10. Search System

The blog uses **Orama** for client-side semantic search — no backend, no API keys, no extra cost.

- Search index is built at page load from the live post list
- Search supports fuzzy matching + weighted field relevance (title > tags > description)
- The `SearchBar` component is a `"use client"` component rendered on the home page
- Future: add embedding-based semantic vector search via `@orama/plugin-embeddings`

---

## 11. What Makes a Good Post for This Blog

Ask these questions before publishing:

1. **Is there a real production constraint?** (scale, cost, reliability, compliance)
2. **Is there a specific decision made?** Not "here's how Kafka works" but "here's why we chose partition count X over Y"
3. **Are there real numbers?** (throughput, latency, cost, incident duration)
4. **Is there something that surprised us or went wrong?** The most valuable posts admit failures.
5. **Would a senior engineer at another company learn something actionable?**

If all five answers are yes, publish it.

---

*Last updated: 2026-09-26 | Maintained by: Akashdip Mahapatra*
