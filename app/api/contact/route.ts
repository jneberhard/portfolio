import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, maximumLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Unsupported request." }, { status: 415 });
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (clean(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 100).replace(/[\r\n]+/g, " ");
  const business = clean(body.business, 120).replace(/[\r\n]+/g, " ");
  const email = clean(body.email, 254).toLowerCase();
  const notes = clean(body.notes, 3000);

  if (!name || !email || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { error: "Name and a valid email are required." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.error("Contact email environment variables are not configured.");
    return NextResponse.json(
      { error: "Contact service unavailable." },
      { status: 503 },
    );
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

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Portfolio contact from ${name}`,
      text: message,
    }),
  });

  if (!response.ok) {
    console.error("Contact email provider rejected the request.", response.status);
    return NextResponse.json(
      { error: "Message could not be sent." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
