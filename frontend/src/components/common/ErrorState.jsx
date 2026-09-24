export default function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading this section. Please try again.',
  onRetry,
  className = '',
}) {
  return (
    <div
      role="alert"
      className={`p-6 border border-stone-800 bg-[#141210] rounded-xs text-center ${className}`}
    >
      <h3 className="text-base font-serif font-semibold text-stone-100 mb-1">{title}</h3>
      <p className="text-sm text-stone-400 mb-4">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#dfc282] bg-[#1a1714] border border-[#c5a880]/30 rounded-xs hover:border-[#c5a880] hover:bg-[#201c18] transition-colors focus-visible:outline-2 focus-visible:outline-[#c5a880]"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
