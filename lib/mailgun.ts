import { formatPrice } from "./types";

type OrderEmail = {
  to: string;
  name: string;
  orderId: string;
  total: number;
  items: { name: string; quantity: number; unitPrice: number }[];
  address: string;
};

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);

export async function sendOrderConfirmation(order: OrderEmail) {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const base = process.env.MAILGUN_API_BASE || "https://api.mailgun.net";
  const from = process.env.MAILGUN_FROM || `Corner Shop <postmaster@${domain}>`;
  if (!apiKey || !domain) throw new Error("Mailgun is not configured");

  const ref = order.orderId.slice(0, 8).toUpperCase();
  const rows = order.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0">${escapeHtml(i.name)} &times; ${i.quantity}</td>` +
        `<td style="padding:6px 0;text-align:right">${formatPrice(i.unitPrice * i.quantity)}</td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#1c1917">
      <h2>Thanks for your order, ${escapeHtml(order.name)}!</h2>
      <p>Order <strong>#${ref}</strong> is confirmed. You'll pay on delivery.</p>
      <table style="width:100%;border-collapse:collapse">${rows}
        <tr><td style="padding-top:12px;border-top:1px solid #ddd"><strong>Total</strong></td>
        <td style="padding-top:12px;border-top:1px solid #ddd;text-align:right"><strong>${formatPrice(order.total)}</strong></td></tr>
      </table>
      <p>Shipping to: ${escapeHtml(order.address)}</p>
    </div>`;

  const text = [
    `Thanks for your order, ${order.name}!`,
    `Order #${ref} is confirmed. You'll pay on delivery.`,
    "",
    ...order.items.map((i) => `${i.name} x ${i.quantity}: ${formatPrice(i.unitPrice * i.quantity)}`),
    `Total: ${formatPrice(order.total)}`,
    `Shipping to: ${order.address}`,
  ].join("\n");

  const res = await fetch(`${base}/v3/${domain}/messages`, {
    method: "POST",
    headers: { Authorization: "Basic " + Buffer.from(`api:${apiKey}`).toString("base64") },
    body: new URLSearchParams({ from, to: order.to, subject: `Order confirmed #${ref}`, text, html }),
  });
  if (!res.ok) throw new Error(`Mailgun ${res.status}: ${await res.text()}`);
}
