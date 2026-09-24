export default function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading this section. Please try again.',
  onRetry,
  className = '',
}) {
  return (
    <div
      role="alert"
      className={`p-6 border border-stone-200 bg-stone-50 rounded-sm text-center ${className}`}
    >
      <h3 className="text-base font-semibold text-stone-900 mb-1">{title}</h3>
      <p className="text-sm text-stone-600 mb-4">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 rounded-sm hover:bg-amber-100 transition-colors focus-visible:outline-2 focus-visible:outline-amber-600"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
