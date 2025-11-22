'use client';

import Tagline from '@/components/ui/Tagline';
import Headline from '@/components/ui/Headline';
import Carousel from '@/components/ui/Carousel';
import PostCard from '@/components/blog/PostCard';
import Container from '@/components/ui/Container';
import { Button } from '@/components/ui/button';
import { setAttr } from '@directus/visual-editing';
import type { Post, PostTag, PostsPostTag } from '@/types/directus-schema';

interface BlogFilteredPostsProps {
  data: {
    id: string;
    tagline?: string;
    headline?: string;
    posts?: Post[];
    limit: number;
    tags_included?: Array<string | PostTag | PostsPostTag> | null;
    tags_excluded?: Array<string | PostTag | PostsPostTag> | null;
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

      // Handle PostTag objects directly (from M2M fields)
      if ('slug' in entry && typeof entry.slug === 'string') {
        return entry.slug;
      }

      // Handle PostsPostTag junction objects (from O2M fields)
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
  // Handle case where data might not be fully loaded
  if (!data || !data.id) {
    return null;
  }

  const {
    tagline,
    headline,
    posts: initialPosts = [],
    limit = 10,
    id,
    tags_included,
    tags_excluded,
    linkText = 'View all posts',
    linkUrl = '/news',
    information,
  } = data;

  // Posts are already fetched server-side in the fetcher
  const posts = initialPosts || [];

  return (
    <section className="block-blog-filtered-posts">
      <Container>
        <div className="flex flex-col lg:justify-between lg:flex-row mb-8">
          <div className="md:max-w-sm">
            {tagline && (
              <Tagline
                tagline={tagline}
                data-directus={setAttr({
                  collection: 'block_filtered_posts',
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
                  collection: 'block_filtered_posts',
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
              collection: 'block_filtered_posts',
              item: id,
              fields: ['limit', 'tags_included', 'tags_excluded'],
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

