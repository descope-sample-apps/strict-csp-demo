import { NextResponse } from "next/server";

export function middleware(request) {
  // set csp
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = `
    connect-src 'self' static.descope.org static.descope.com api.descope.org api.descope.com;
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http: static.descope.org static.descope.com ${
    process.env.NODE_ENV === "production" ? "" : `'unsafe-eval'`
  };
    style-src 'self' 'unsafe-inline' fonts.googleapis.com; 
    img-src 'self' blob: data: static.descope.org static.descope.com;
    font-src 'self' fonts.gstatic.com static.descope.org static.descope.com data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue
  );

  // get config from request params
  const url = new URL(request.url);
  const projectId = url.searchParams.get("projectId");
  const baseUrl = url.searchParams.get("baseUrl");

  const DEFAULT_PROJECT = "P2CqCdq2bnO9JS2awFKlIPngwPUK";
  const DEFAULT_BASE_URL = "https://api.descope.org";

  if (!projectId || !baseUrl) {
    return NextResponse.redirect(
      new URL(
        `/?projectId=${DEFAULT_PROJECT}&baseUrl=${DEFAULT_BASE_URL}`,
        url.origin
      )
    );
  }

  response.headers.set("x-project-id", projectId);
  response.headers.set("x-base-url", baseUrl);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
