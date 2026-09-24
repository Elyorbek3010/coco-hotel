import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { useLanguage } from '../hooks/useLanguage';
import { getPromotions } from '../api/hotel';
import Container from '../components/common/Container';
import SectionTitle from '../components/common/SectionTitle';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import RevealOnScroll from '../components/common/RevealOnScroll';

export default function PromotionsPage() {
  const { t } = useLanguage();
  usePageMeta({
    title: t('meta.offersTitle'),
    description: t('meta.offersDesc'),
    canonicalPath: '/promotions',
  });

  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    getPromotions()
      .then((data) => {
        setPromotions(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    getPromotions()
      .then((data) => {
        if (isMounted) {
          setPromotions(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col bg-theme-main transition-colors duration-200">
      {/* 1. HERO HEADER */}
      <section
        aria-label="Promotions Header"
        className="bg-theme-secondary text-theme-main py-16 sm:py-24 border-b border-theme transition-colors duration-200"
      >
        <Container className="text-center">
          <RevealOnScroll variant="up">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-theme-gold mb-3">
              {t('promotions.specialPrivileges')}
            </p>
            <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-theme-main tracking-tight mb-4">
              {t('promotions.exclusiveOffers')}
            </h1>
            <p className="text-base sm:text-lg text-theme-muted font-light max-w-2xl mx-auto leading-relaxed">
              {t('promotions.intro')}
            </p>
          </RevealOnScroll>
        </Container>
      </section>

      {/* 2. PROMOTIONS LIST */}
      <section aria-label="Available Offers" className="py-16 sm:py-24 bg-theme-main">
        <Container>
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState onRetry={handleRetry} />
          ) : promotions.length === 0 ? (
            <div className="text-center py-16 px-6 bg-theme-surface border border-theme rounded-xs max-w-xl mx-auto space-y-4 shadow-md">
              <span className="inline-block p-3 rounded-full bg-theme-elevated text-theme-gold border border-theme">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </span>
              <h2 className="font-serif text-2xl font-semibold text-theme-main">
                {t('promotions.noActiveOffers')}
              </h2>
              <p className="text-sm text-theme-muted leading-relaxed max-w-md mx-auto font-light">
                {t('promotions.noActiveDesc')}
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/rooms"
                  className="inline-flex items-center px-6 py-2.5 text-xs font-semibold uppercase tracking-widest bg-theme-gold text-stone-950 rounded-xs hover:brightness-110 transition-colors"
                >
                  {t('rooms.browseAccommodations')}
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-2.5 text-xs font-semibold uppercase tracking-widest border border-theme-gold text-theme-gold hover:bg-theme-surface rounded-xs transition-colors"
                >
                  {t('rooms.contactConcierge')}
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              <RevealOnScroll variant="up">
                <SectionTitle
                  subtitle={t('promotions.curatedStays')}
                  title={t('promotions.currentPrivileges')}
                />
              </RevealOnScroll>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {promotions.map((promo, idx) => (
                  <RevealOnScroll key={promo.id} variant="up" delay={idx * 80}>
                    <article
                      className="bg-theme-surface border border-theme rounded-xs overflow-hidden shadow-md hover:shadow-xl hover:border-[var(--color-gold)] transition-all duration-300 flex flex-col h-full"
                    >
                      {promo.image && (
                        <div className="aspect-16/9 overflow-hidden bg-theme-elevated">
                          <img
                            src={promo.image}
                            alt={promo.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-6 sm:p-8 flex-1 flex flex-col">
                        <h2 className="font-serif text-xl font-semibold text-theme-main mb-2">
                          {promo.title}
                        </h2>
                        <p className="text-sm text-theme-muted leading-relaxed mb-6 line-clamp-3 font-light">
                          {promo.short_description}
                        </p>

                        <div className="mt-auto pt-4 border-t border-theme flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="text-theme-muted font-light">
                            {promo.valid_until ? (
                              <span>{t('home.validUntil')} {promo.valid_until}</span>
                            ) : (
                              <span className="text-theme-gold font-medium">{t('home.limitedAvailability')}</span>
                            )}
                          </div>
                          <Link
                            to={`/promotions/${promo.slug}`}
                            className="font-semibold text-theme-gold hover:underline self-start sm:self-auto inline-flex items-center gap-1 uppercase tracking-wider text-[11px]"
                          >
                            {t('promotions.viewDetails')} &rarr;
                          </Link>
                        </div>
                      </div>
                    </article>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
