'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChevronFirst, ChevronLast } from 'lucide-react';
import Tagline from '@/components/ui/Tagline';
import Headline from '@/components/ui/Headline';
import DirectusImage from '@/components/shared/DirectusImage';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import type { Post, PostTag, PostsPostTag } from '@/types/directus-schema';
import { fetchPaginatedPosts } from '@/lib/directus/fetchers';
import { setAttr } from '@directus/visual-editing';


interface PostsProps {
  data: {
    id: string;
    tagline?: string;
    headline?: string;
    posts: Post[];
    limit: number;
    totalPages: number;
    post_tags?: Array<string | PostTag | PostsPostTag> | null;
    post_tags_exclude?: Array<string | PostTag | PostsPostTag> | null;
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

const Posts = ({ data }: PostsProps) => {
  const { tagline, headline, posts, limit, totalPages, id, post_tags, post_tags_exclude } = data;
  const visiblePages = 5;
  const perPage = limit || 6;
  const tagSlugs = useMemo(() => resolveTagSlugs(post_tags), [post_tags]);
  const excludeTagSlugs = useMemo(() => resolveTagSlugs(post_tags_exclude), [post_tags_exclude]);
  const tagFilterKey = tagSlugs.join(',');
  const excludeTagFilterKey = excludeTagSlugs.join(',');

  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      return Number(sp.get('page')) || 1;
    }

    return 1;
  });

  const [paginatedPosts, setPaginatedPosts] = useState<Post[]>(currentPage === 1 ? posts : []);

  useEffect(() => {
    const fetchPosts = async () => {
      if (currentPage === 1) {
        setPaginatedPosts(posts);
        return;
      }

      try {
        const response = await fetchPaginatedPosts(perPage, currentPage, tagSlugs, excludeTagSlugs);
        setPaginatedPosts(response);
      } catch {
        throw new Error('Error fetching paginated posts:');
      }
    };

    fetchPosts();
  }, [currentPage, perPage, posts, tagFilterKey, tagSlugs, excludeTagFilterKey, excludeTagSlugs]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [tagFilterKey, excludeTagFilterKey, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);

      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', `?page=${page}`);
      }
    }
  };

  const generatePagination = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= visiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const rangeStart = Math.max(1, currentPage - 2);
      const rangeEnd = Math.min(totalPages, currentPage + 2);

      if (rangeStart > 1) {
        pages.push(1);
        if (rangeStart > 2) pages.push('ellipsis-start');
      }

      for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(i);
      }

      if (rangeEnd < totalPages - 1) pages.push('ellipsis-end');
      if (rangeEnd < totalPages) pages.push(totalPages);
    }

    return pages;
  };

  const paginationLinks = generatePagination();

  return (
    <div className="block-posts">
      {tagline && (
        <Tagline
          tagline={tagline}
          data-directus={setAttr({
            collection: 'block_posts',
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
            collection: 'block_posts',
            item: id,
            fields: 'headline',
            mode: 'popover',
          })}
        />
      )}

      <div
        className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        data-directus={setAttr({
          collection: 'block_posts',
          item: id,
          fields: ['collection', 'limit', 'post_tags', 'post_tags_exclude'],
          mode: 'popover',
        })}
      >
        {paginatedPosts.length > 0 ? (
          paginatedPosts.map((post) => (
                            <a key={post.id} href={`/news/${post.slug}`} className="group block overflow-hidden rounded-lg">
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                {post.image && (
                  <DirectusImage
                    uuid={typeof post.image === 'string' ? post.image : post.image?.id}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full h-auto object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl group-hover:text-accent font-heading transition-colors duration-300">
                  {post.title}
                </h3>
                {post.description && <p className="text-sm text-foreground mt-2">{post.description}</p>}
              </div>
            </a>
          ))
        ) : (
          <p className="text-center text-gray-500">No posts available.</p>
        )}
      </div>
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {totalPages > visiblePages && currentPage > 1 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(1);
                  }}
                >
                  <ChevronFirst className="size-5" />
                </PaginationLink>
              </PaginationItem>
            )}

            {totalPages > visiblePages && currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                />
              </PaginationItem>
            )}

            {paginationLinks.map((page, index) =>
              typeof page === 'number' ? (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ) : (
                <PaginationItem key={index}>
                  <PaginationEllipsis />
                </PaginationItem>
              ),
            )}

            {totalPages > visiblePages && currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                />
              </PaginationItem>
            )}

            {totalPages > visiblePages && currentPage < totalPages && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(totalPages);
                  }}
                >
                  <ChevronLast className="size-5" />
                </PaginationLink>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default Posts;
