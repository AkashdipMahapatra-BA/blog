import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, getAllTags } from '@/lib/posts';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';

export default function HomePage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div>
      {/* ─── Hero Section ──────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">Engineering Architecture & Systems Notes</h1>
          <p className="hero-subtitle">
            Deep-dive explorations into event-driven stream processing, distributed cloud
            infrastructure, zero-downtime reliability engineering, and real-world incident post-mortems.
          </p>

          <div className="hero-meta-bar">
            <div className="author-chip">
              <img
                src="/akashdip.jpg"
                alt="Akashdip Mahapatra"
                className="author-img"
              />
              <div>
                <div className="author-name">Akashdip Mahapatra</div>
                <div className="author-role">Data Engineer & Cloud Automation Specialist | SRE</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Articles List ────────────────────────────────────────────── */}
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        <div className="posts-grid">
          {posts.map((post) => (
            <article key={post.slug} className="post-card">
              <div className="post-card-meta">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={14} />
                  {post.publishedAt}
                </span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={14} />
                  {post.readingTime}
                </span>
                <span>•</span>
                <span>By {post.author}</span>
              </div>

              <h2 className="post-card-title">
                <Link href={`/${post.slug}/`}>{post.title}</Link>
              </h2>

              <p className="post-card-desc">{post.description}</p>

              <div className="tags-row">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag-badge">
                    #{tag}
                  </span>
                ))}
              </div>

              <div>
                <Link href={`/${post.slug}/`} className="read-more-link">
                  Read Full Architecture Case Study <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}

          {posts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              No technical articles found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
