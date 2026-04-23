export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
      <div className="h-80 animate-pulse rounded-[28px] bg-surface-900/80" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div className="h-28 animate-pulse rounded-[28px] bg-surface-900/80" key={item} />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-[28px] bg-surface-900/80" />
    </main>
  );
}
