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
            <div className="author-socials" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href="https://akashdipmahapatra.in"
                target="_blank"
                rel="noopener noreferrer"
                className="read-more-link"
              >
                Visit Main Portfolio <ArrowUpRight size={15} />
              </a>

              <SplitGithubButton />
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
