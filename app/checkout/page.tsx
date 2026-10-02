import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/auth";
import { CheckoutForm } from "./checkout-form";

export default async function CheckoutPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/checkout");

  return <CheckoutForm email={user.email ?? ""} defaultName={user.fullName ?? ""} />;
}
