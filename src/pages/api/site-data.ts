import type { APIRoute } from 'astro';
import { fetchSiteData } from '@/lib/directus/fetchers';

export const GET: APIRoute = async ({ url }) => {
  const isEditing = url.searchParams.get('visual-editing') === 'true';

  if (!isEditing) {
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const siteData = await fetchSiteData();
    return new Response(JSON.stringify(siteData), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error in /api/site-data:', error);
    // Return fallback data instead of 500 error
    return new Response(
      JSON.stringify({
        globals: null,
        headerNavigation: null,
        footerNavigation: null,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
