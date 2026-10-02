"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/types";
import { placeOrder, type CheckoutState } from "./actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-100";

export function CheckoutForm({ email, defaultName }: { email: string; defaultName: string }) {
  const { items, ready, subtotal } = useCart();
  const [state, formAction, pending] = useActionState<CheckoutState, FormData>(placeOrder, {});

  if (!ready) return null;

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">Nothing to check out</h1>
        <Link href="/" className="mt-4 inline-block text-orange-600 hover:underline">
          Browse products →
        </Link>
      </div>
    );
  }

  const cart = JSON.stringify(items.map((i) => ({ productId: i.productId, quantity: i.quantity })));

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="mt-1 text-sm text-stone-500">
          Confirmation will be sent to <strong>{email}</strong>
        </p>

        <input type="hidden" name="cart" value={cart} />

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium sm:col-span-2">
            Full name
            <input name="fullName" required defaultValue={defaultName} className={inputClass} />
          </label>
          <label className="block text-sm font-medium sm:col-span-2">
            Street address
            <input name="address" required className={inputClass} />
          </label>
          <label className="block text-sm font-medium">
            City
            <input name="city" required className={inputClass} />
          </label>
          <label className="block text-sm font-medium">
            Phone
            <input name="phone" type="tel" required className={inputClass} />
          </label>
        </div>

        <div className="mt-6 rounded-lg bg-stone-100 p-4 text-sm">
          <strong>Payment:</strong> Pay on delivery (cash or card to the courier).
        </div>
      </section>

      <aside className="h-fit rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="font-semibold">Order summary</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {items.map((i) => (
            <li key={i.productId} className="flex justify-between gap-2">
              <span>
                {i.name} × {i.quantity}
              </span>
              <span>{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-stone-200 pt-4 text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {state.error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-lg bg-orange-600 px-4 py-3 font-medium text-white hover:bg-orange-700 disabled:opacity-60"
        >
          {pending ? "Placing order…" : "Place order"}
        </button>
      </aside>
    </form>
  );
}
