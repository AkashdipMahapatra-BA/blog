export interface PostMeta {
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  tags: string[];
  readingTime: string;
  featured?: boolean;
}

export interface Post extends PostMeta {
  content: string;
  htmlContent: string;
}
