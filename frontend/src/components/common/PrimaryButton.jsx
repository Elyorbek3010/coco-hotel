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
      'bg-[#c5a880] text-[#0c0a09] font-semibold hover:bg-[#dfc282] focus-visible:outline-[#c5a880] shadow-sm active:bg-[#a68a60]',
    secondary:
      'bg-[#181614] border border-stone-800 text-stone-200 hover:bg-stone-800 hover:text-white focus-visible:outline-[#c5a880]',
    outline:
      'border border-[#c5a880]/40 text-[#c5a880] hover:bg-[#c5a880]/10 hover:border-[#c5a880] focus-visible:outline-[#c5a880]',
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
