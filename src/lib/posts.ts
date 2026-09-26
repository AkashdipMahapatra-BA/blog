import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { Post, PostMeta } from './types';

const postsDirectory = path.join(process.cwd(), 'content/posts');

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

export function calculateReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData: PostMeta[] = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      const slug = data.slug || fileName.replace(/\.md$/, '');
      const readingTime = data.readingTime || calculateReadingTime(content);

      return {
        slug,
        title: data.title || 'Untitled Post',
        description: data.description || '',
        publishedAt: data.publishedAt || new Date().toISOString().split('T')[0],
        updatedAt: data.updatedAt,
        author: data.author || 'Akashdip Mahapatra',
        authorRole: data.authorRole || 'Data Engineer & Cloud Automation Specialist | SRE — Enterprise Aviation Data Platforms',
        authorAvatar: data.authorAvatar || '/akashdip.jpg',
        tags: Array.isArray(data.tags) ? data.tags : [],
        readingTime,
        featured: Boolean(data.featured),
      };
    });

  // Sort posts by date descending
  return allPostsData.sort((a, b) => (new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!fs.existsSync(postsDirectory)) {
    return null;
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const targetFile = fileNames.find((fileName) => {
    if (!fileName.endsWith('.md')) return false;
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    return data.slug === slug || fileName.replace(/\.md$/, '') === slug;
  });

  if (!targetFile) {
    return null;
  }

  const fullPath = path.join(postsDirectory, targetFile);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const readingTime = data.readingTime || calculateReadingTime(content);
  const htmlContent = await marked.parse(content);

  return {
    slug: data.slug || targetFile.replace(/\.md$/, ''),
    title: data.title || 'Untitled Post',
    description: data.description || '',
    publishedAt: data.publishedAt || new Date().toISOString().split('T')[0],
    updatedAt: data.updatedAt,
    author: data.author || 'Akashdip Mahapatra',
    authorRole: data.authorRole || 'Data Engineer & Cloud Automation Specialist | SRE — Enterprise Aviation Data Platforms',
    authorAvatar: data.authorAvatar || '/akashdip.jpg',
    tags: Array.isArray(data.tags) ? data.tags : [],
    readingTime,
    featured: Boolean(data.featured),
    content,
    htmlContent,
  };
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}
