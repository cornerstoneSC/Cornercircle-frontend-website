const encoder = new TextEncoder();
export const ADMIN_SESSION_COOKIE = "csc_admin_session";

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  return value && value.length >= 32 ? value : null;
}

async function signature(payload: string) {
  const value = secret();
  if (!value) return null;
  const key = await crypto.subtle.importKey("raw", encoder.encode(value), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function createAdminSession() {
  const payload = String(Date.now() + 8 * 60 * 60 * 1000);
  const signed = await signature(payload);
  return signed ? `${payload}.${signed}` : null;
}

export async function verifyAdminSession(value?: string) {
  if (!value) return false;
  const [payload, supplied, extra] = value.split(".");
  if (!payload || !supplied || extra || !/^\d+$/.test(payload) || Number(payload) <= Date.now()) return false;
  const expected = await signature(payload);
  if (!expected || expected.length !== supplied.length) return false;
  let difference = 0;
  for (let index = 0; index < expected.length; index += 1) difference |= expected.charCodeAt(index) ^ supplied.charCodeAt(index);
  return difference === 0;
}
