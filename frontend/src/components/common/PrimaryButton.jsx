import { Link } from 'react-router-dom';

export default function PrimaryButton({
  children,
  to,
  href,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-200 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-amber-700 text-white hover:bg-amber-800 focus-visible:outline-amber-700 shadow-sm active:bg-amber-900',
    secondary:
      'bg-stone-900 text-white hover:bg-stone-800 focus-visible:outline-stone-900 active:bg-stone-950',
    outline:
      'border border-stone-300 text-stone-800 hover:bg-stone-100 hover:text-stone-950 focus-visible:outline-stone-400',
  };

  const combinedClasses = `${baseClasses} ${variants[variant] || variants.primary} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClasses} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  );
}
