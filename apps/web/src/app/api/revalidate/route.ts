import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ error: "REVALIDATE_SECRET no está configurado" }, { status: 500 });
  }

  const body = await request.text();
  const received = request.headers.get("x-revalidate-signature") ?? "";
  const expected = createHmac("sha256", secret).update(body).digest("hex");

  const valid =
    received.length === expected.length &&
    timingSafeEqual(Buffer.from(received), Buffer.from(expected));

  if (!valid) {
    return Response.json({ error: "Firma inválida" }, { status: 401 });
  }

  let payload: { event?: string; tags?: unknown } = {};
  try {
    payload = JSON.parse(body);
  } catch {
    return Response.json({ error: "Cuerpo JSON inválido" }, { status: 400 });
  }

  const tags =
    Array.isArray(payload.tags) && payload.tags.length > 0
      ? payload.tags.map(String)
      : ["cms"];

  for (const tag of tags) {
    revalidateTag(tag);
  }

  return Response.json({ revalidated: true, event: payload.event ?? null, tags });
}
