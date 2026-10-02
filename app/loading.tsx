export default function Loading() {
  return (
    <div className="flex justify-center py-24" aria-busy="true" aria-label="Loading">
      <div className="size-8 animate-spin rounded-full border-4 border-stone-200 border-t-orange-600" />
    </div>
  );
}
