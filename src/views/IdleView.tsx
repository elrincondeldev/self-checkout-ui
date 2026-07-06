export function IdleView() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-10 bg-gradient-to-b from-sky-600 to-sky-800 px-8 text-center text-white">
      <div aria-hidden className="animate-pulse text-9xl">📡</div>
      <h1 className="text-6xl font-extrabold tracking-tight">
        Scan a product to start
      </h1>
      <p className="max-w-2xl text-3xl text-sky-100">
        Hold your item near the reader and it will appear on screen
      </p>
    </main>
  )
}
