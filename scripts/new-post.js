#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const title = process.argv[2];

if (!title) {
  console.log('\n❌ Please provide a post title.');
  console.log('Usage: npm run new-post "Your Post Title Here"\n');
  process.exit(1);
}

// Generate slug
const slug = title
  .toLowerCase()
  .replace(/[^\w\s-]/g, '')
  .trim()
  .replace(/\s+/g, '-');

const today = new Date().toISOString().split('T')[0];
const postsDir = path.join(__dirname, '..', 'content', 'posts');

if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

const targetFile = path.join(postsDir, `${slug}.md`);

if (fs.existsSync(targetFile)) {
  console.log(`\n⚠️ Post already exists at: ${targetFile}\n`);
  process.exit(1);
}

const template = `---
title: "${title}"
slug: "${slug}"
description: "A short, compelling summary of this post for search engines and preview cards."
publishedAt: "${today}"
author: "Akashdip Mahapatra"
authorRole: "Data Engineer & Cloud Automation Specialist | SRE"
authorAvatar: "/akashdip.jpg"
tags: ["System Design", "AWS", "DevOps"]
readingTime: "5 min read"
featured: false
---

## Introduction

Write an engaging introduction to the technical challenge or architecture you solved.

## The Problem & Constraints

- Constraint 1
- Constraint 2
- Performance / Scale requirements

## Architecture & Implementation

\`\`\`
  [Client] ──► [API Gateway] ──► [Lambda / Container] ──► [Database]
\`\`\`

Explain the key decisions and code snippets here.

## Production Results & Lessons Learned

- Metric 1: 50% latency reduction
- Key takeaway from production rollout
`;

fs.writeFileSync(targetFile, template, 'utf8');

console.log(`\n✅ Successfully created new post!`);
console.log(`📄 Path: content/posts/${slug}.md`);
console.log(`🌐 URL preview: https://blog.akashdipmahapatra.in/${slug}/\n`);
