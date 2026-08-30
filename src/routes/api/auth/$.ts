import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { getAuth, hasHostedAuthConfig } from "@/lib/auth";
import { isHostedAuthMode, isPublicSignupEnabled } from "@/lib/auth-mode";

async function handleAuthRequest(request: Request) {
  if (!isHostedAuthMode(env.AUTH_MODE)) {
    return new Response("Not found", {
      status: 404,
    });
  }

  if (!hasHostedAuthConfig()) {
    return new Response("Missing Better Auth hosted configuration", {
      status: 500,
    });
  }

  const pathname = new URL(request.url).pathname;
  if (
    !isPublicSignupEnabled(env.PUBLIC_SIGNUP_ENABLED) &&
    (pathname.endsWith("/sign-up/email") ||
      pathname.endsWith("/sign-in/social"))
  ) {
    return Response.json(
      { message: "Public signup is not open yet." },
      { status: 503 },
    );
  }

  const auth = getAuth();
  return auth.handler(request);
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        return handleAuthRequest(request);
      },
      POST: async ({ request }: { request: Request }) => {
        return handleAuthRequest(request);
      },
    },
  },
});
