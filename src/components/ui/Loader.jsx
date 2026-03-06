export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="h-10 w-10 rounded-full border-4 border-black/10 border-t-primary animate-spin" />
      <p className="text-sm font-medium text-black/60">Loading...</p>
    </div>
  );
}
