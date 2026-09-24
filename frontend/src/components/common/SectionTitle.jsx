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
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#c5a880] mb-2.5">
          {subtitle}
        </p>
      )}
      <HeadingTag className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold text-stone-100 tracking-tight">
        {title}
      </HeadingTag>
    </div>
  );
}
