import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { useLanguage } from '../hooks/useLanguage';
import Container from '../components/common/Container';
import RevealOnScroll from '../components/common/RevealOnScroll';

export default function NotFoundPage() {
  const { t } = useLanguage();
  usePageMeta({
    title: '404',
    description: t('notFound.desc'),
    canonicalPath: '/404',
  });

  return (
    <div className="py-24 sm:py-32 bg-theme-main min-h-[60vh] flex items-center transition-colors duration-200">
      <Container className="text-center">
        <RevealOnScroll variant="up">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-theme-gold mb-3">
            404
          </p>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-theme-main tracking-tight mb-4">
            {t('notFound.title')}
          </h1>
          <p className="text-base sm:text-lg text-theme-muted max-w-md mx-auto mb-8 font-light leading-relaxed">
            {t('notFound.desc')}
          </p>
          <div>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-8 py-3.5 text-xs font-semibold uppercase tracking-widest bg-theme-gold text-stone-950 rounded-xs hover:brightness-110 active:brightness-95 transition-all shadow-sm focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
            >
              {t('notFound.returnHome')}
            </Link>
          </div>
        </RevealOnScroll>
      </Container>
    </div>
  );
}
