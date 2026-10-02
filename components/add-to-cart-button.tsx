"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "./cart-provider";

export function AddToCartButton({ product }: { product: Product }) {
  const { add, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.some((i) => i.productId === product.id);

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => {
          add({
            productId: product.id,
            name: product.name,
            price: Number(product.price),
            imageUrl: product.image_url,
          });
          setAdded(true);
          setTimeout(() => setAdded(false), 1200);
        }}
        className="w-full rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
      >
        {added ? "Added ✓" : "Add to cart"}
      </button>
      {inCart && (
        <Link href="/checkout" className="block text-center text-sm font-medium text-orange-600 hover:underline">
          Checkout →
        </Link>
      )}
    </div>
  );
}
