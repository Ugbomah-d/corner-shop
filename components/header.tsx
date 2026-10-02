import Link from "next/link";
import { getUser } from "@/lib/supabase/auth";
import { signOut } from "@/app/auth/actions";
import { CartLink } from "./cart-link";

export async function Header() {
  const user = await getUser();

  return (
    <header className="border-b border-stone-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Corner<span className="text-orange-600">Shop</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <Link href="/orders" className="hidden hover:underline sm:inline">
                My orders
              </Link>
              <span className="hidden text-stone-500 md:inline">{user.email}</span>
              <form action={signOut}>
                <button className="hover:underline">Sign out</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="hover:underline">
              Sign in
            </Link>
          )}
          <CartLink />
        </nav>
      </div>
    </header>
  );
}
