import type { QueryFilter } from '@directus/sdk';
import { useDirectus } from './directus';
import type { BlockPost, Page, PageBlock, Post, PostTag, PostsPostTag, Schema } from '@/types/directus-schema';

const { directus, readItems, readItem, readSingleton, aggregate } = useDirectus();

/**
 * Fetches page data by permalink, including all nested blocks and dynamically fetching blog posts if required.
 */
export const fetchPageData = async (permalink: string, postPage = 1): Promise<Page> => {
  try {
    const pageData = await directus.request(
      readItems('pages', {
        filter: { permalink: { _eq: permalink } },
        limit: 1,
            fields: [
              'title',
              'seo',
              'id',
              'accent_color_override',
              'background_theme_override',
              'custom_background_color',
              'custom_text_color',
              {
                blocks: [
                  'id',
                  'background',
                  'collection',
                  'item',
                  'sort',
                  'hide_block',
                ],
              },
            ],
        deep: {
          blocks: { _sort: ['sort'], _filter: { hide_block: { _neq: true } } },
        },
      }),
    );

    if (!pageData.length) {
      throw new Error('Page not found');
    }

    const page = pageData[0];

    // Fetch block content for each block
    if (Array.isArray(page.blocks)) {
      console.log('FETCHER: Starting to process blocks, count:', page.blocks.length);
      for (const block of page.blocks as PageBlock[]) {
        console.log('FETCHER: Block:', block.collection, 'Item:', block.item, 'Type:', typeof block.item);
        if (block.item && block.collection) {
          console.log('FETCHER: Fetching content for', block.collection);
          try {
            let blockContent;
            
            switch (block.collection) {
              case 'block_features':
                blockContent = await directus.request(
                  readItem('block_features', block.item as string, {
                    fields: ['id', 'tagline', 'headline', 'description', 'icon_color', { features_items: ['id', 'title', 'description', 'icon', 'sort'] }],
                    deep: { features_items: { _sort: ['sort'] } },
                  }),
                );
                break;
              case 'block_content':
                blockContent = await directus.request(
                  readItem('block_content', block.item as string, {
                    fields: ['id', 'tagline', 'headline', 'content', 'image', 'image_position', { button_fixed: ['id', 'label', 'variant', 'url', 'type', { page: ['permalink'] }, { post: ['slug'] }] }],
                  }),
                );
                break;
                    case 'block_steps':
                      blockContent = await directus.request(
                        readItem('block_steps', block.item as string, {
                          fields: ['id', 'tagline', 'headline', 'description', { steps_items: ['id', 'title', 'description', 'icon', 'image', 'sort'] }],
                          deep: { steps_items: { _sort: ['sort'] } },
                        }),
                      );
                      break;
              case 'block_stats':
                blockContent = await directus.request(
                  readItem('block_stats', block.item as string, {
                    fields: ['id', 'tagline', 'headline', 'background_color', { stats_items: ['id', 'number', 'label', 'description', 'sort'] }],
                    deep: { stats_items: { _sort: ['sort'] } },
                  }),
                );
                break;
              case 'block_call_to_action':
                blockContent = await directus.request(
                  readItem('block_call_to_action', block.item as string, {
                    fields: ['id', 'tagline', 'headline', 'content', 'background_color', { button_group: ['id', { buttons: ['id', 'label', 'variant', 'url', 'type', { page: ['permalink'] }, { post: ['slug'] }] }] }],
                  }),
                );
                break;
              case 'block_image_grid':
                blockContent = await directus.request(
                  readItem('block_image_grid', block.item as string, {
                    fields: ['id', 'tagline', 'headline', 'description', 'columns', { image_grid_items: ['id', 'title', 'description', 'image', 'sort'] }],
                    deep: { image_grid_items: { _sort: ['sort'] } },
                  }),
                );
                break;
              case 'block_hero':
                blockContent = await directus.request(
                  readItem('block_hero', block.item as string, {
                    fields: ['id', 'tagline', 'headline', 'description', 'image', 'layout', { button_group: ['id', { buttons: ['id', 'label', 'variant', 'url', 'type', { page: ['permalink'] }, { post: ['slug'] }] }] }],
                  }),
                );
                break;
                    case 'block_richtext':
                      blockContent = await directus.request(
                        readItem('block_richtext', block.item as string, {
                          fields: ['id', 'tagline', 'headline', 'content', 'alignment', 'width', 'background'],
                        }),
                      );
                       break;
              case 'block_pricing':
                blockContent = await directus.request(
                  readItem('block_pricing', block.item as string, {
                    fields: ['id', 'tagline', 'headline', { pricing_cards: ['id', 'title', 'description', 'price', 'badge', 'features', { button: ['id', 'label', 'variant', 'url', 'type', { page: ['permalink'] }, { post: ['slug'] }] }] }],
                  }),
                );
                break;
              case 'block_gallery':
                blockContent = await directus.request(
                  readItem('block_gallery', block.item as string, {
                    fields: ['id', 'tagline', 'headline', 'items'],
                  }),
                );
                break;
              case 'block_form':
                blockContent = await directus.request(
                  readItem('block_form', block.item as string, {
                    fields: ['id', 'tagline', 'headline', { form: ['id', 'title', 'description'] }],
                  }),
                );
                break;
              case 'block_button_group':
                blockContent = await directus.request(
                  readItem('block_button_group', block.item as string, {
                    fields: ['id', { buttons: ['id', 'label', 'variant', 'url', 'type', { page: ['permalink'] }, { post: ['slug'] }, 'sort'] }],
                    deep: { buttons: { _sort: ['sort'] } },
                  }),
                );
                break;
              case 'block_posts':
                blockContent = await directus.request(
                  readItem('block_posts', block.item as string, {
                    fields: [
                      'id',
                      'tagline',
                      'headline',
                      'collection',
                      'limit',
                      {
                        post_tags: [
                          'id',
                          {
                            post_tags_id: ['id', 'slug'],
                          },
                        ],
                      },
                      {
                        post_tags_exclude: [
                          'id',
                          {
                            post_tags_id: ['id', 'slug'],
                          },
                        ],
                      },
                    ],
                  }),
                );
                break;
              case 'block_filtered_posts':
                blockContent = await directus.request(
                  readItem('block_filtered_posts', block.item as string, {
                    fields: [
                      'id',
                      'tagline',
                      'headline',
                      'limit',
                      'linkText',
                      'linkUrl',
                      'information',
                      {
                        tags_included: [
                          'id',
                          {
                            post_tags_id: ['id', 'slug'],
                          },
                        ],
                      },
                      {
                        tags_excluded: [
                          'id',
                          {
                            post_tags_id: ['id', 'slug'],
                          },
                        ],
                      },
                    ],
                  }),
                );
                break;
              default:
                // For any other blocks, keep the original logic
                continue;
            }
            
            if (blockContent) {
              // Replace the item ID with the actual content
              (block as any).item = blockContent;
            }
          } catch (error) {
            console.error(`Error fetching block content for ${block.collection}:`, error);
          }
        }
      }
    }

    if (Array.isArray(page.blocks)) {
      for (const block of page.blocks as PageBlock[]) {
        if (
          block.collection === 'block_posts' &&
          typeof block.item === 'object' &&
          (block.item as BlockPost).collection === 'posts'
        ) {
          const limit = (block.item as BlockPost).limit ?? 6;
          const tagSlugs = extractTagSlugs((block.item as BlockPost).post_tags);
          const tagSlugsExclude = extractTagSlugs((block.item as BlockPost).post_tags_exclude);

          const posts = await directus.request<Post[]>(
            readItems('posts', {
              fields: ['id', 'title', 'description', 'slug', 'image', 'status', 'published_at'],
              filter: buildPostsFilter(tagSlugs, tagSlugsExclude),
              sort: ['-published_at'],
              limit,
              page: postPage,
            }),
          );

          const countResponse = await directus.request(
            aggregate('posts', {
              aggregate: { count: '*' },
              filter: buildPostsFilter(tagSlugs, tagSlugsExclude),
            }),
          );

          const totalPages = Math.ceil(Number(countResponse[0]?.count || 0) / limit);

          (block.item as BlockPost & { posts: Post[]; totalPages: number }).posts = posts;
          (block.item as BlockPost & { totalPages: number }).totalPages = totalPages;
        }

        if (block.collection === 'block_filtered_posts' && typeof block.item === 'object') {
          const blockItem = block.item as any;
          const limit = blockItem.limit ?? 10;
          const tagSlugs = extractTagSlugs(blockItem.tags_included);
          const tagSlugsExclude = extractTagSlugs(blockItem.tags_excluded);

          const posts = await directus.request<Post[]>(
            readItems('posts', {
              fields: ['id', 'title', 'description', 'slug', 'image', 'status', 'published_at'],
              filter: buildPostsFilter(tagSlugs, tagSlugsExclude),
              sort: ['-published_at'],
              limit,
            }),
          );

          (block.item as any).posts = posts;
        }
      }
    }

    return page as any;
  } catch (error) {
    console.error('Error fetching page data:', error);
    throw new Error('Failed to fetch page data');
  }
};

/**
 * Fetches global site data, header navigation, and footer navigation.
 */
export const fetchSiteData = async () => {
  try {
    const [globals, headerNavigation, footerNavigation] = await Promise.all([
      directus.request(
        readSingleton('globals', {
          fields: ['id', 'title', 'description', 'logo', 'logo_dark_mode', 'social_links', 'accent_color', 'favicon'],
        }),
      ),
      directus.request(
        readItem('navigation', 'main', {
          fields: [
            'id',
            'title',
            {
              items: [
                'id',
                'title',
                'url',
                {
                  page: ['permalink'],
                  children: ['id', 'title', 'url', { page: ['permalink'] }],
                },
              ],
            },
          ],
          deep: { items: { _sort: ['sort'] } },
        }),
      ),
      directus.request(
        readItem('navigation', 'footer', {
          fields: [
            'id',
            'title',
            {
              items: [
                'id',
                'title',
                'url',
                {
                  page: ['permalink'],
                  children: ['id', 'title', 'url', { page: ['permalink'] }],
                },
              ],
            },
          ],
        }),
      ),
    ]);

    return { globals, headerNavigation, footerNavigation };
  } catch (error) {
    console.error('Error fetching site data:', error);
    throw new Error('Failed to fetch site data');
  }
};

/**
 * Fetches a single blog post by slug. Handles live preview mode
 */
export const fetchPostBySlug = async (slug: string, preview: boolean = false, token: string | null = null) => {
  try {
    const filter: QueryFilter<Schema, Post> = preview
      ? { slug: { _eq: slug } }
      : { slug: { _eq: slug }, status: { _eq: 'published' } };

    const posts = await directus.request(
      readItems('posts', {
        filter,
        limit: 1,
        fields: ['id', 'title', 'content', 'status', 'image', 'description', 'author', 'seo', 'is_event', 'event_name', 'event_start_datetime', 'event_end_datetime', 'event_info', 'ticket_url', 'more_info_url', 'venue_street', 'venue_city', 'venue_state', 'venue_postcode', 'contact_phone', 'contact_email'],
        ...(token ? { access_token: token } : {}),
      }),
    );

    const post = posts[0];

    if (!post) {
      return null;
    }

    return post;
  } catch (error) {
    console.error(`Error fetching post with slug "${slug}":`, error);
    throw new Error(`Failed to fetch post with slug "${slug}"`);
  }
};

/**
 * Fetches related blog posts excluding the given ID.
 */
export const fetchRelatedPosts = async (excludeId: string) => {
  try {
    const relatedPosts = await directus.request(
      readItems('posts', {
        filter: { status: { _eq: 'published' }, id: { _neq: excludeId } },
        fields: ['id', 'title', 'image', 'slug', 'seo'],
        limit: 2,
      }),
    );

    return relatedPosts;
  } catch {
    throw new Error('Failed to fetch related posts');
  }
};

/**
 * Fetches author details by ID.
 */
export const fetchAuthorById = async (authorId: string) => {
  const { directus, readUser } = useDirectus();

  try {
    const author = await directus.request(
      readUser(authorId, {
        fields: ['id', 'first_name', 'last_name', 'avatar'],
      }),
    );

    return author;
  } catch {
    throw new Error(`Failed to fetch author with ID "${authorId}"`);
  }
};

/**
 * Fetches paginated blog posts.
 */
export const fetchPaginatedPosts = async (
  limit: number,
  page: number,
  tagSlugs?: string[],
  excludeTagSlugs?: string[],
) => {
  try {
    const response = await directus.request(
      readItems('posts', {
        limit,
        page,
        sort: ['-published_at'],
        fields: ['id', 'title', 'description', 'slug', 'image'],
        filter: buildPostsFilter(tagSlugs, excludeTagSlugs),
      }),
    );

    return response;
  } catch {
    throw new Error('Failed to fetch paginated posts');
  }
};

function extractTagSlugs(raw?: Array<string | PostTag | PostsPostTag> | null): string[] {
  if (!raw) return [];
  
  const slugs = raw
    .map((entry) => {
      if (typeof entry === 'string') return entry;
      if (!entry) return null;

      // Handle PostTag objects directly (from M2M fields when properly expanded)
      if ('slug' in entry && typeof entry.slug === 'string') {
        return entry.slug;
      }

      // Handle junction objects with post_tags_id (from M2M junction tables)
      // Structure: { id: 1, block_filtered_posts_id: "...", post_tags_id: { id: "...", slug: "..." } }
      if ('post_tags_id' in entry && entry.post_tags_id) {
        const tag = entry.post_tags_id;
        if (typeof tag === 'string') {
          // If it's just a UUID string, we can't extract slug - need to fetch it
          return null;
        }
        if (typeof tag === 'object' && tag && 'slug' in tag && typeof tag.slug === 'string') {
          return tag.slug;
        }
      }

      return null;
    })
    .filter((slug): slug is string => typeof slug === 'string' && slug.trim().length > 0);

  return Array.from(new Set(slugs));
}

function buildPostsFilter(tagSlugs?: string[], excludeTagSlugs?: string[]): QueryFilter<Schema, Post> {
  const baseFilter: QueryFilter<Schema, Post> = {
    _and: [{ status: { _eq: 'published' } }],
  };

  // Apply included tags filter: posts must have at least one of the included tags
  if (tagSlugs && tagSlugs.length > 0) {
    baseFilter._and?.push({
      post_tags: {
        _some: {
          post_tags_id: {
            slug: {
              _in: tagSlugs,
            },
          },
        },
      },
    } as QueryFilter<Schema, Post>);
  }

  // Apply excluded tags filter: posts must NOT have any excluded tags
  // This overrides included tags - if a post has an excluded tag, it will be filtered out
  // even if it also has an included tag
  if (excludeTagSlugs && excludeTagSlugs.length > 0) {
    baseFilter._and?.push({
      post_tags: {
        _none: {
          post_tags_id: {
            slug: {
              _in: excludeTagSlugs,
            },
          },
        },
      },
    } as QueryFilter<Schema, Post>);
  }

  return baseFilter;
}

/**
 * Search pages and posts for a given search term
 */
export const searchContent = async (search: string) => {
  try {
    const [pages, posts] = await Promise.all([
      directus.request(
        readItems('pages', {
          filter: {
            _or: [{ title: { _contains: search } }, { permalink: { _contains: search } }],
          },
          fields: ['id', 'title', 'permalink', 'seo'],
        }),
      ),
      directus.request(
        readItems('posts', {
          filter: {
            _and: [
              { status: { _eq: 'published' } },
              {
                _or: [
                  { title: { _contains: search } },
                  { description: { _contains: search } },
                  { slug: { _contains: search } },
                  { content: { _contains: search } },
                ],
              },
            ],
          },
          fields: ['id', 'title', 'description', 'slug', 'content', 'status'],
        }),
      ),
    ]);

    return [
      ...pages.map((page) => ({
        id: page.id,
        title: page.title,
        description: page.seo?.meta_description,
        type: 'Page',
        link: `/${page.permalink.replace(/^\/+/, '')}`,
      })),
      ...posts.map((post) => ({
        id: post.id,
        title: post.title,
        description: post.description,
        type: 'Post',
        link: `/news/${post.slug}`,
      })),
    ];
  } catch {
    throw new Error('Failed to search content');
  }
};

export const fetchAllPosts = async (): Promise<Post[]> => {
  try {
    const posts = await directus.request(
      readItems('posts', {
        fields: ['id', 'slug', 'status', 'title', 'content', 'description', 'image', 'author', 'seo', 'published_at'],
        filter: { status: { _eq: 'published' } },
      }),
    );

    return posts;
  } catch {
    throw new Error('Failed to fetch all blog posts');
  }
};
export const fetchAllPages = async (): Promise<Page[]> => {
  try {
    const pages = await directus.request(
      readItems('pages', {
        fields: ['id', 'permalink', 'title'],
      }),
    );

    return pages.filter((p) => typeof p.permalink === 'string');
  } catch (error) {
    console.error('Error fetching all pages:', error);
    throw new Error('Failed to fetch all pages');
  }
};
