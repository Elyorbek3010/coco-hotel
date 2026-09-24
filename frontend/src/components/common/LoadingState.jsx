export default function LoadingState({ message = 'Loading...', className = '' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center p-8 text-stone-400 ${className}`}
    >
      <div
        className="w-8 h-8 border-3 border-stone-800 border-t-[#c5a880] rounded-full animate-spin mb-3"
        aria-hidden="true"
      />
      <p className="text-sm font-normal text-stone-400">{message}</p>
      <span className="sr-only">{message}</span>
    </div>
  );
}
