"use client";

import { useEffect } from "react";
import { useCart } from "./cart-provider";

/** Empties the cart once the order confirmation page loads. */
export function ClearCart() {
  const { ready, clear } = useCart();
  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);
  return null;
}
