import type { APIRoute } from 'astro';
import { fetchPageData } from '@/lib/directus/fetchers';
export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const permalink = url.searchParams.get('permalink') || '/';

  try {
    const page = await fetchPageData(permalink);

    const blocks = (page?.blocks ?? []).filter((block: any) => typeof block === 'object' && block.collection);

    return new Response(JSON.stringify({ blocks }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in /api/page-blocks:', error);
    // Return empty blocks array instead of 500 error
    return new Response(JSON.stringify({ blocks: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
