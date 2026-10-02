import { cache } from "react";
import { createClient } from "./server";

export type SessionUser = {
  id: string;
  email?: string;
  fullName?: string;
};

/**
 * Returns the signed-in user, or null.
 * getClaims() verifies the session JWT locally against the project's public signing
 * key, so this costs no network round trip; cache() dedupes it within one request.
 */
export const getUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) return null;

  const { sub, email, user_metadata } = data.claims;
  return { id: sub, email, fullName: user_metadata?.full_name as string | undefined };
});
