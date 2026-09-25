import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { ArrowLeft, Calendar, Clock, Tag, Share2, ArrowUpRight } from 'lucide-react';
import { SplitGithubButton } from '@/components/SplitGithubButton';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const url = `https://blog.akashdipmahapatra.in/${post.slug}/`;

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <article>
      {/* ─── Article Header ────────────────────────────────────────────── */}
      <header className="article-header">
        <div className="container">
          <Link href="/" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to All Technical Notes</span>
          </Link>

          <h1 className="article-title">{post.title}</h1>

          <div className="article-meta-bar">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={15} />
              Published on {post.publishedAt}
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={15} />
              {post.readingTime}
            </span>
            <span>•</span>
            <span>By {post.author}</span>
          </div>

          <div className="tags-row">
            {post.tags.map((tag) => (
              <span key={tag} className="tag-badge">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* ─── Article Content ───────────────────────────────────────────── */}
      <div className="container">
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.htmlContent }}
        />

        {/* ─── Author Card at Bottom ───────────────────────────────────── */}
        <section className="article-author-card">
          <img
            src={post.authorAvatar}
            alt={post.author}
            className="article-author-img"
          />
          <div className="article-author-info">
            <h4>Written by {post.author}</h4>
            <p>
              {post.authorRole}. Passionate about automating operational toil,
              architecting fault-tolerant streaming pipelines on AWS MSK, and hardening enterprise
              cloud environments.
            </p>
            <div className="author-socials" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a
                href="https://akashdipmahapatra.in"
                target="_blank"
                rel="noopener noreferrer"
                className="read-more-link"
              >
                Visit Main Portfolio <ArrowUpRight size={15} />
              </a>

              <a
                href="https://www.linkedin.com/in/akashdip2001"
                target="_blank"
                rel="noopener noreferrer"
                className="author-linkedin-btn"
                title="Connect with Akashdip Mahapatra on LinkedIn"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span>LinkedIn</span>
              </a>

              <SplitGithubButton />
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
