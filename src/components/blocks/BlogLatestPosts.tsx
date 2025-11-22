'use client';

import { useState, useEffect, useMemo } from 'react';
import Tagline from '@/components/ui/Tagline';
import Headline from '@/components/ui/Headline';
import Carousel from '@/components/ui/Carousel';
import PostCard from '@/components/blog/PostCard';
import Container from '@/components/ui/Container';
import { Button } from '@/components/ui/button';
import { setAttr } from '@directus/visual-editing';
import type { Post, PostTag, PostsPostTag } from '@/types/directus-schema';
import { fetchPaginatedPosts } from '@/lib/directus/fetchers';

interface BlogFilteredPostsProps {
  data: {
    id: string;
    tagline?: string;
    headline?: string;
    posts: Post[];
    limit: number;
    post_tags?: Array<string | PostTag | PostsPostTag> | null;
    post_tags_exclude?: Array<string | PostTag | PostsPostTag> | null;
    linkText?: string;
    linkUrl?: string;
    information?: string;
  };
}

const resolveTagSlugs = (raw?: Array<string | PostTag | PostsPostTag> | null): string[] => {
  if (!raw) return [];

  const slugs = raw
    .map((entry) => {
      if (typeof entry === 'string') return entry;
      if (!entry) return null;

      if ('slug' in entry && typeof entry.slug === 'string') {
        return entry.slug;
      }

      if ('post_tags_id' in entry && entry.post_tags_id) {
        const tag = entry.post_tags_id;

        if (typeof tag === 'string') return tag;
        if (typeof tag === 'object' && tag && 'slug' in tag && typeof tag.slug === 'string') {
          return tag.slug;
        }
      }

      return null;
    })
    .filter((slug): slug is string => typeof slug === 'string' && slug.trim().length > 0);

  return Array.from(new Set(slugs));
};

const BlogFilteredPosts = ({ data }: BlogFilteredPostsProps) => {
  const {
    tagline,
    headline,
    posts: initialPosts,
    limit,
    id,
    post_tags,
    post_tags_exclude,
    linkText = 'View all posts',
    linkUrl = '/news',
    information,
  } = data;

  const tagSlugs = useMemo(() => resolveTagSlugs(post_tags), [post_tags]);
  const excludeTagSlugs = useMemo(() => resolveTagSlugs(post_tags_exclude), [post_tags_exclude]);
  const tagFilterKey = tagSlugs.join(',');
  const excludeTagFilterKey = excludeTagSlugs.join(',');

  const [posts, setPosts] = useState<Post[]>(initialPosts || []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetchPaginatedPosts(limit || 10, 1, tagSlugs, excludeTagSlugs);
        setPosts(response);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts(initialPosts || []);
      }
    };

    fetchPosts();
  }, [limit, tagFilterKey, excludeTagFilterKey, tagSlugs, excludeTagSlugs, initialPosts]);

  return (
    <section className="block-blog-filtered-posts">
      <Container>
        <div className="flex flex-col lg:justify-between lg:flex-row mb-8">
          <div className="md:max-w-sm">
            {tagline && (
              <Tagline
                tagline={tagline}
                data-directus={setAttr({
                  collection: 'block_blog_filtered_posts',
                  item: id,
                  fields: 'tagline',
                  mode: 'popover',
                })}
              />
            )}
            {headline && (
              <Headline
                headline={headline}
                data-directus={setAttr({
                  collection: 'block_blog_filtered_posts',
                  item: id,
                  fields: 'headline',
                  mode: 'popover',
                })}
              />
            )}
            {linkText && linkUrl && (
              <Button variant="link" href={linkUrl} className="mt-2">
                {linkText} »
              </Button>
            )}
          </div>

          {information && (
            <p
              className="text-muted dark:text-slate-400 lg:text-sm lg:max-w-md mt-4 lg:mt-0"
              dangerouslySetInnerHTML={{ __html: information }}
            />
          )}
        </div>

        {posts.length > 0 ? (
          <div
            data-directus={setAttr({
              collection: 'block_blog_filtered_posts',
              item: id,
              fields: ['limit', 'post_tags', 'post_tags_exclude'],
              mode: 'popover',
            })}
          >
            <Carousel showControls gap={24}>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </Carousel>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No posts available.</p>
        )}
      </Container>
    </section>
  );
};

export default BlogFilteredPosts;

