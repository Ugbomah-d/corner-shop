"use client";

import Link from "next/link";
import { useCart } from "./cart-provider";

export function CartLink() {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      className="relative rounded-full border border-stone-300 px-4 py-1.5 text-sm font-medium hover:border-stone-900"
    >
      Cart
      {count > 0 && (
        <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-orange-600 px-1.5 text-xs font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
