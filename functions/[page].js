export const onRequest = async ({ request, env }) => {
  const url = new URL(request.url);

  // Cache key based on the pathname
  const cacheKey = `ISR:${url.pathname}`;
  const cache = caches.default;

  // Check if the response is in the cache
  let response = await cache.match(request);

  if (!response) {
    // If not in cache, fetch from origin (Astro server)
    response = await fetch(request);

    // Set caching headers (e.g., 60 seconds max age)
    response = new Response(response.body, response);
    response.headers.append('Cache-Control', 's-maxage=60, stale-while-revalidate=30');

    // Put the response in the cache
    await cache.put(request, response);
  }

  return response;
};
