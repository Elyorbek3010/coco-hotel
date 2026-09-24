export default function SectionTitle({
  title,
  subtitle,
  centered = false,
  className = '',
  as = 'h2',
}) {
  const HeadingTag = as;
  return (
    <div className={`mb-8 ${centered ? 'text-center' : ''} ${className}`}>
      {subtitle && (
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-2">
          {subtitle}
        </p>
      )}
      <HeadingTag className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 tracking-tight">
        {title}
      </HeadingTag>
    </div>
  );
}
