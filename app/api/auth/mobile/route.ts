import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { OAuth2Client } from "google-auth-library";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { db } from "@/lib/db";
import { accessTokenTtlSeconds, signAccessToken } from "@/lib/auth-token";

export const runtime = "nodejs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "http://localhost:8081",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const bodySchema = z.object({
  provider: z.enum(["google", "apple"]),
  idToken: z.string(),
  email: z.string().email().optional(),
});

const appleJwks = createRemoteJWKSet(new URL("https://appleid.apple.com/auth/keys"));

function decodeJwtPayloadForDebug(idToken: string) {
  try {
    const payloadPart = idToken.split(".")[1];
    if (!payloadPart) return null;
    const payloadJson = Buffer.from(payloadPart, "base64url").toString("utf8");
    return JSON.parse(payloadJson) as {
      aud?: string | string[];
      azp?: string;
      iss?: string;
    };
  } catch {
    return null;
  }
}

function getAppleAudiences() {
  const audiences = [
    process.env.APPLE_CLIENT_ID,
    process.env.APPLE_SERVICE_ID,
    process.env.APPLE_BUNDLE_ID,
  ].filter((value): value is string => Boolean(value));

  return audiences;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400, headers: CORS_HEADERS });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400, headers: CORS_HEADERS });
  }

  let email: string | undefined;
  let name: string | undefined;
  let image: string | undefined;

  if (parsed.data.provider === "google") {
    const audiences = [
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_IOS_CLIENT_ID,
      process.env.GOOGLE_ANDROID_CLIENT_ID,
      process.env.GOOGLE_EXPO_CLIENT_ID,
    ].filter((value): value is string => Boolean(value));

    if (audiences.length === 0) {
      return NextResponse.json({ error: "server_error" }, { status: 500, headers: CORS_HEADERS });
    }

    const client = new OAuth2Client(audiences[0]);
    try {
      const ticket = await client.verifyIdToken({
        idToken: parsed.data.idToken,
        audience: audiences,
      });
      const payload = ticket.getPayload();
      email = payload?.email;
      name = payload?.name ?? undefined;
      image = payload?.picture ?? undefined;
    } catch {
      if (process.env.NODE_ENV !== "production") {
        const decoded = decodeJwtPayloadForDebug(parsed.data.idToken);
        return NextResponse.json(
          {
            error: "invalid_token",
            reason: "audience_mismatch",
            expectedAudiences: audiences,
            token: {
              aud: decoded?.aud,
              azp: decoded?.azp,
              iss: decoded?.iss,
            },
          },
          { status: 401, headers: CORS_HEADERS },
        );
      }
      return NextResponse.json({ error: "invalid_token" }, { status: 401, headers: CORS_HEADERS });
    }
  } else {
    const audiences = getAppleAudiences();
    if (audiences.length === 0) {
      return NextResponse.json({ error: "server_error" }, { status: 500, headers: CORS_HEADERS });
    }

    try {
      const { payload } = await jwtVerify(parsed.data.idToken, appleJwks, {
        issuer: "https://appleid.apple.com",
        audience: audiences,
      });
      email = typeof payload.email === "string" ? payload.email : parsed.data.email;
    } catch {
      return NextResponse.json({ error: "invalid_token" }, { status: 401, headers: CORS_HEADERS });
    }
  }

  if (!email) {
    return NextResponse.json({ error: "invalid_token" }, { status: 401, headers: CORS_HEADERS });
  }

  const user = await db.user.upsert({
    where: { email },
    update: {
      name: name ?? undefined,
      image: image ?? undefined,
    },
    create: {
      email,
      name: name ?? null,
      image: image ?? null,
    },
  });

  const accessToken = await signAccessToken({ userId: user.id, email: user.email });
  return NextResponse.json(
    {
      accessToken,
      tokenType: "Bearer",
      expiresIn: accessTokenTtlSeconds(),
    },
    { headers: CORS_HEADERS },
  );
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
