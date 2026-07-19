function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request, env) {
    if (!env.ASSETS?.fetch) {
      return new Response("Static asset service unavailable", { status: 503 });
    }

    let response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("Accept")?.includes("text/html");

    if (response.status === 404 && request.method === "GET" && acceptsHtml) {
      const indexUrl = new URL("/index.html", request.url);
      response = await env.ASSETS.fetch(new Request(indexUrl, request));
    }

    return withSecurityHeaders(response);
  },
};
