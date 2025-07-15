import { authMiddleware } from "@descope/nextjs-sdk/server";
import { NextRequest, NextResponse } from "next/server";

export default async (request: NextRequest) => {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const cspHeader = `
    connect-src 'self' static.descope.com api.descope.com;
    style-src 'self' fonts.googleapis.com 'nonce-${nonce}';
    img-src 'self' static.descope.com data:;
    font-src fonts.gstatic.com descopecdn.com data:;
    script-src 'self' descopecdn.com static.descope.com 'nonce-${nonce}';
  `;

  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();
  request.headers.set("x-nonce", nonce);

  const response = await authMiddleware()(request);
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue
  );

  return response;
};

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
