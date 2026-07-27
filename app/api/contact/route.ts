import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_LENGTH = 12_000;
const MIN_FORM_TIME_MS = 1_500;
const MAX_FORM_AGE_MS = 2 * 60 * 60 * 1_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimits = new Map<string, RateLimitEntry>();

function json(
  body: Record<string, unknown>,
  status = 200,
  extraHeaders?: HeadersInit,
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      Vary: "Origin, Sec-Fetch-Site",
      ...extraHeaders,
    },
  });
}

function clean(value: unknown, maximumLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

function cleanSingleLine(value: unknown, maximumLength: number) {
  return clean(value, maximumLength).replace(/[\u0000-\u001f\u007f]+/g, " ");
}

function cleanMultiline(value: unknown, maximumLength: number) {
  return clean(value, maximumLength).replace(
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,
    "",
  );
}

function isTrustedRequest(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return false;
  }

  const origin = request.headers.get("origin");
  return Boolean(origin && origin === new URL(request.url).origin);
}

function getClientIdentifier(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  return createHash("sha256").update(ip).digest("hex");
}

function checkRateLimit(identifier: string) {
  const now = Date.now();

  if (rateLimits.size > 500) {
    for (const [key, entry] of rateLimits) {
      if (entry.resetAt <= now) {
        rateLimits.delete(key);
      }
    }

    while (rateLimits.size > 1_000) {
      const oldestKey = rateLimits.keys().next().value;
      if (typeof oldestKey !== "string") {
        break;
      }
      rateLimits.delete(oldestKey);
    }
  }

  const existing = rateLimits.get(identifier);

  if (!existing || existing.resetAt <= now) {
    rateLimits.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return null;
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return Math.max(1, Math.ceil((existing.resetAt - now) / 1_000));
  }

  existing.count += 1;
  return null;
}

function createIdempotencyKey(
  name: string,
  business: string,
  email: string,
  notes: string,
) {
  const fiveMinuteWindow = Math.floor(Date.now() / (5 * 60 * 1_000));
  return createHash("sha256")
    .update([name, business, email, notes, fiveMinuteWindow].join("\u0000"))
    .digest("hex");
}

export async function POST(request: Request) {
  if (
    !isTrustedRequest(request) ||
    request.headers.get("x-requested-with") !== "portfolio-contact-form"
  ) {
    return json({ error: "Request not allowed." }, 403);
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ error: "Unsupported request." }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_LENGTH) {
    return json({ error: "Request is too large." }, 413);
  }

  let body: Record<string, unknown>;

  try {
    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_LENGTH) {
      return json({ error: "Request is too large." }, 413);
    }

    const parsed = JSON.parse(rawBody);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return json({ error: "Invalid request." }, 400);
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  if (clean(body.website, 200)) {
    return json({ ok: true });
  }

  const startedAt = Number(body.startedAt);
  const formAge = Date.now() - startedAt;
  if (
    !Number.isFinite(startedAt) ||
    formAge < MIN_FORM_TIME_MS ||
    formAge > MAX_FORM_AGE_MS
  ) {
    return json({ error: "Please reopen the form and try again." }, 400);
  }

  const name = cleanSingleLine(body.name, 100);
  const business = cleanSingleLine(body.business, 120);
  const email = cleanSingleLine(body.email, 254).toLowerCase();
  const notes = cleanMultiline(body.notes, 3000);

  if (!name || !email || !EMAIL_PATTERN.test(email)) {
    return json(
      { error: "Name and a valid email are required." },
      400,
    );
  }

  const retryAfter = checkRateLimit(getClientIdentifier(request));
  if (retryAfter) {
    return json(
      { error: "Too many messages. Please try again later." },
      429,
      { "Retry-After": String(retryAfter) },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.error("Contact email environment variables are not configured.");
    return json({ error: "Contact service unavailable." }, 503);
  }

  const message = [
    "New portfolio contact request",
    "",
    `Name: ${name}`,
    `Business: ${business || "Not provided"}`,
    `Email: ${email}`,
    "",
    "Notes:",
    notes || "No notes provided.",
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": createIdempotencyKey(
          name,
          business,
          email,
          notes,
        ),
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio contact from ${name}`,
        text: message,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error(
        "Contact email provider rejected the request.",
        response.status,
      );
      return json({ error: "Message could not be sent." }, 502);
    }
  } catch {
    console.error("Contact email provider could not be reached.");
    return json({ error: "Message could not be sent." }, 502);
  }

  return json({ ok: true });
}
