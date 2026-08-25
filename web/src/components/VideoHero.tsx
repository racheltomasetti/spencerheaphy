export function VideoHero({src, caption}: {src?: string; caption?: string}) {
  return (
    <div className="relative aspect-video w-full overflow-hidden bg-foreground">
      {src ? (
        <video
          className="h-full w-full object-cover"
          src={src}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <div className="absolute inset-0 animate-[hero-drift_12s_ease-in-out_infinite] bg-[linear-gradient(120deg,#1d1c18,#2a2823,#141310,#232019)] bg-[length:200%_200%]" />
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/10 px-6 text-center">
        <h1 className="font-serif text-4xl font-normal uppercase tracking-[0.08em] text-background sm:text-6xl md:text-7xl">
          Spencer Heaphy
        </h1>
        {caption && (
          <p className="text-xs uppercase tracking-[0.2em] text-background/70">{caption}</p>
        )}
      </div>
    </div>
  )
}
