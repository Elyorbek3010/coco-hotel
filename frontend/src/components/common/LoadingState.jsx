export default function LoadingState({ message = 'Loading...', className = '' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center p-8 text-stone-600 ${className}`}
    >
      <div
        className="w-8 h-8 border-3 border-stone-200 border-t-amber-700 rounded-full animate-spin mb-3"
        aria-hidden="true"
      />
      <p className="text-sm font-medium text-stone-600">{message}</p>
      <span className="sr-only">{message}</span>
    </div>
  );
}
