import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { useLanguage } from '../hooks/useLanguage';
import { getPromotionBySlug } from '../api/hotel';
import Container from '../components/common/Container';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import RevealOnScroll from '../components/common/RevealOnScroll';

export default function PromotionDetailPage() {
  const { slug } = useParams();
  const { t } = useLanguage();
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);

  const pageTitle = promotion
    ? promotion.title
    : errorStatus === 404
      ? t('promotions.offerNotFound')
      : t('nav.promotions');
  const pageDescription = promotion?.short_description
    ? `${promotion.title} — ${promotion.short_description}`
    : t('meta.offersDesc');

  usePageMeta({
    title: pageTitle,
    description: pageDescription,
    canonicalPath: `/promotions/${slug}`,
  });

  const handleRetry = () => {
    setLoading(true);
    setErrorStatus(null);
    getPromotionBySlug(slug)
      .then((data) => {
        setPromotion(data);
        setLoading(false);
      })
      .catch((err) => {
        const status = err.response?.status || 500;
        setErrorStatus(status);
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    getPromotionBySlug(slug)
      .then((data) => {
        if (isMounted) {
          setPromotion(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          const status = err.response?.status || 500;
          setErrorStatus(status);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 bg-theme-main transition-colors duration-200">
        <Container>
          <LoadingState />
        </Container>
      </div>
    );
  }

  if (errorStatus === 404) {
    return (
      <div className="py-24 sm:py-32 bg-theme-main transition-colors duration-200">
        <Container className="text-center max-w-xl mx-auto space-y-6">
          <span className="inline-block p-3 rounded-full bg-theme-elevated text-theme-gold border border-theme">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </span>
          <h1 className="text-3xl font-serif font-semibold text-theme-main">
            {t('promotions.offerUnavailableTitle')}
          </h1>
          <p className="text-base text-theme-muted leading-relaxed font-light">
            {t('promotions.offerUnavailableDesc')}
          </p>
          <div>
            <Link
              to="/promotions"
              className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest bg-theme-gold text-stone-950 rounded-xs hover:brightness-110 transition-colors"
            >
              &larr; {t('promotions.returnToOffers')}
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  if (errorStatus) {
    return (
      <div className="py-24 bg-theme-main transition-colors duration-200">
        <Container>
          <ErrorState onRetry={handleRetry} />
        </Container>
      </div>
    );
  }

  if (!promotion) {
    return null;
  }

  const hasValidity = promotion.valid_from || promotion.valid_until;

  return (
    <div className="flex flex-col bg-theme-main transition-colors duration-200">
      {/* 1. BREADCRUMB NAVIGATION */}
      <nav aria-label="Breadcrumb" className="bg-theme-secondary border-b border-theme py-3 transition-colors duration-200">
        <Container>
          <ol className="flex items-center space-x-2 text-xs text-theme-muted">
            <li>
              <Link to="/" className="hover:text-theme-gold transition-colors">
                {t('nav.home')}
              </Link>
            </li>
            <li aria-hidden="true" className="text-theme-subtle">/</li>
            <li>
              <Link to="/promotions" className="hover:text-theme-gold transition-colors">
                {t('nav.promotions')}
              </Link>
            </li>
            <li aria-hidden="true" className="text-theme-subtle">/</li>
            <li className="text-theme-main font-medium truncate max-w-xs sm:max-w-md">
              {promotion.title}
            </li>
          </ol>
        </Container>
      </nav>

      {/* 2. PROMOTION CONTENT */}
      <article className="py-12 sm:py-20 bg-theme-main">
        <Container>
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Header info */}
            <RevealOnScroll variant="up">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-theme-gold bg-theme-elevated px-2.5 py-1 rounded-xs border border-theme">
                    {t('promotions.exclusivePrivilege')}
                  </span>
                  {hasValidity && (
                    <span className="text-xs text-theme-muted font-mono">
                      {promotion.valid_from && `${t('home.validUntil')} ${promotion.valid_from} `}
                      {promotion.valid_until && `— ${promotion.valid_until}`}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-theme-main tracking-tight leading-tight">
                  {promotion.title}
                </h1>

                {promotion.short_description && (
                  <p className="text-lg text-theme-muted font-light leading-relaxed">
                    {promotion.short_description}
                  </p>
                )}
              </div>
            </RevealOnScroll>

            {/* Banner image if available */}
            {promotion.image && (
              <RevealOnScroll variant="fade">
                <div className="aspect-16/9 overflow-hidden rounded-xs bg-theme-elevated border border-theme shadow-xl">
                  <img
                    src={promotion.image}
                    alt={promotion.title}
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              </RevealOnScroll>
            )}

            {/* Detailed Description */}
            <RevealOnScroll variant="up">
              <div className="bg-theme-surface border border-theme rounded-xs p-8 sm:p-12 space-y-6 shadow-xl transition-colors duration-200">
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-theme-gold pb-2 border-b border-theme">
                  {t('promotions.packageDetails')}
                </h2>

                <div className="text-base text-theme-muted leading-relaxed space-y-4 whitespace-pre-line font-light">
                  {promotion.description}
                </div>
              </div>
            </RevealOnScroll>

            {/* Booking & Concierge Actions */}
            <RevealOnScroll variant="up">
              <div className="p-8 sm:p-10 bg-theme-surface rounded-xs border border-theme flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl transition-colors duration-200">
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-semibold text-theme-main">
                    {t('promotions.interested')}
                  </h3>
                  <p className="text-xs text-theme-muted font-light">
                    {t('promotions.interestedDesc')}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 shrink-0">
                  <Link
                    to="/booking"
                    className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest bg-theme-gold text-stone-950 rounded-xs hover:brightness-110 active:brightness-95 transition-all shadow-sm focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
                  >
                    {t('booking.requestBooking')}
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest border border-theme-gold text-theme-gold hover:bg-theme-elevated rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
                  >
                    {t('home.contactDesk')}
                  </Link>
                </div>
              </div>
            </RevealOnScroll>

            {/* Back link */}
            <div className="pt-4">
              <Link
                to="/promotions"
                className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-theme-gold hover:underline transition-colors"
              >
                &larr; {t('promotions.backToOffers')}
              </Link>
            </div>
          </div>
        </Container>
      </article>
    </div>
  );
}
