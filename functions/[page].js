export const onRequest = async ({ request }) => {
  const url = new URL(request.url);

  // Create a unique cache key based on the pathname
  const cacheKey = new Request(url.toString(), request);
  const cache = caches.default;

  // Try to retrieve a cached response
  let response = await cache.match(cacheKey);

  if (!response) {
    // If no cached response, fetch the origin response
    response = await fetch(request);

    // Customize response headers to enforce caching
    response = new Response(response.body, response);
    response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=30');

    // Store the response in the cache
    await cache.put(cacheKey, response.clone());
  }

  // Serve the cached response regardless of request headers
  return response;
};
