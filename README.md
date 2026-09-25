# 🚀 Akashdip Mahapatra — Systems Architecture & Engineering Blog
**Live Domain:** [blog.akashdipmahapatra.in](https://blog.akashdipmahapatra.in)  
**Main Portfolio:** [akashdipmahapatra.in](https://akashdipmahapatra.in)

This repository contains the standalone, high-performance static engineering blog for **Akashdip Mahapatra**, built with **Next.js 15 (Static Export)**, TypeScript, and Markdown/MDX.

---

## 🏗️ Architecture & Features

- **Blazing Fast Static Export:** Generates 100% pre-rendered HTML/CSS (`output: 'export'`), ready to host on GitHub Pages, Vercel, or Cloudflare Pages with zero server overhead.
- **Default Light Theme:** Styled to match the light theme aesthetic of `akashdipmahapatra.in`, featuring a dark theme toggle for reader convenience.
- **Clean Markdown Content Architecture:** Every post lives in `content/posts/*.md` with YAML frontmatter. Adding a new post takes 10 seconds.
- **SEO & Social Cards:** Generates OpenGraph meta tags, Twitter summary cards, dynamic `sitemap.xml`, and `robots.txt`.
- **Automated CI/CD:** GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically builds and deploys to GitHub Pages upon pushing to `main`.

---

## 📁 Repository Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml           # Automated GitHub Pages CI/CD workflow
├── content/
│   └── posts/                   # All markdown blog posts live here
│       └── enterprise-event-driven-streaming.md
├── public/
│   ├── CNAME                    # Custom domain: blog.akashdipmahapatra.in
│   ├── robots.txt               # Search engine directives
│   └── akashdip.jpg             # Author profile image
├── scripts/
│   └── new-post.js              # CLI tool to scaffold new posts
├── src/
│   ├── app/
│   │   ├── [slug]/
│   │   │   └── page.tsx         # Dynamic post detail page
│   │   ├── globals.css          # Design system matching portfolio
│   │   ├── layout.tsx           # Site layout with theme loader
│   │   ├── page.tsx             # Blog home index page
│   │   └── sitemap.ts           # Dynamic XML sitemap generator
│   ├── components/
│   │   ├── Header.tsx           # Top navigation with portfolio link
│   │   ├── Footer.tsx           # Social links & copyright
│   │   └── ThemeToggle.tsx      # Light/Dark mode switcher
│   └── lib/
│       ├── posts.ts             # Post parsing & reading time calculator
│       └── types.ts             # TypeScript interfaces
├── next.config.mjs              # Static export configuration
├── package.json
└── tsconfig.json
```

---

## 🛠️ Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build & Test Static Export
```bash
npm run build
```
The static site will be compiled into the `out/` folder.

---

## ✍️ How to Publish a New Blog Post

### Option 1: Use the Scaffolding Script (Fastest)
Run:
```bash
npm run new-post "Your Post Title Here"
```
This automatically creates a new markdown file in `content/posts/your-post-title-here.md` pre-populated with frontmatter, author details, and template headings.

### Option 2: Create a File Manually
Create a `.md` file in `content/posts/`:
```markdown
---
title: "Your Deep-Dive Post Title"
slug: "your-post-slug"
description: "A short, engaging description for SEO and card previews."
publishedAt: "2026-10-15"
author: "Akashdip Mahapatra"
authorRole: "Data Engineer & Cloud Automation Specialist | SRE"
authorAvatar: "/akashdip.jpg"
tags: ["System Design", "AWS", "Kafka", "SRE"]
readingTime: "8 min read"
featured: true
---

Your markdown content here...
```

Push to `main`, and GitHub Actions will automatically rebuild and deploy within 60 seconds!

---

## 🌐 Spaceship DNS & GitHub Pages Setup Guide

To link your custom subdomain `blog.akashdipmahapatra.in` using Spaceship:

1. **GitHub Repository Settings:**
   - In GitHub, go to your repo: **Settings → Pages**.
   - Under **Build and deployment → Source**, select **GitHub Actions**.
   - Under **Custom domain**, enter: `blog.akashdipmahapatra.in` and click **Save**.
   - Check **Enforce HTTPS** once the DNS check passes.

2. **Spaceship DNS Records:**
   - Go to your **Spaceship Domain Manager** for `akashdipmahapatra.in`.
   - Add a **CNAME Record**:
     - **Host / Name:** `blog`
     - **Value / Target:** `<your-github-username>.github.io.` (e.g. `akashdipmahapatra-ba.github.io.`)
     - **TTL:** Automatic or 300 / 3600 seconds.
