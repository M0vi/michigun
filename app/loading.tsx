export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="w-12 h-12 rounded-full border-2 border-t-red-500 border-zinc-800 animate-spin" />
      <span className="text-zinc-500 text-sm font-mono animate-pulse">Carregando</span>
    </div>
  )
}