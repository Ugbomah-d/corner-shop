import { GoogleButton } from "./google-button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm py-20 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Sign in</h1>
      <p className="mt-2 text-stone-600">Sign in with Google to check out and track your orders.</p>
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          Sign-in failed. Please try again.
        </p>
      )}
      <div className="mt-8">
        <GoogleButton next={next ?? "/"} />
      </div>
    </div>
  );
}
