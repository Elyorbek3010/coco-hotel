import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { getPromotionBySlug } from '../api/hotel';
import Container from '../components/common/Container';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';

export default function PromotionDetailPage() {
  const { slug } = useParams();
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);

  const pageTitle = promotion
    ? promotion.title
    : errorStatus === 404
      ? 'Offer Not Found'
      : 'Special Offer';
  const pageDescription = promotion?.short_description
    ? `${promotion.title} — ${promotion.short_description}`
    : 'Explore current Coco Hotel promotions and offers.';

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
      <div className="py-24 bg-[#0c0a09]">
        <Container>
          <LoadingState message="Loading offer details..." />
        </Container>
      </div>
    );
  }

  if (errorStatus === 404) {
    return (
      <div className="py-24 sm:py-32 bg-[#0c0a09]">
        <Container className="text-center max-w-xl mx-auto space-y-6">
          <span className="inline-block p-3 rounded-full bg-[#1c1916] text-[#c5a880] border border-[#c5a880]/30">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </span>
          <h1 className="text-3xl font-serif font-semibold text-stone-100">
            Offer Unavailable or Expired
          </h1>
          <p className="text-base text-stone-300 leading-relaxed font-light">
            The special offer or package you are looking for is no longer active, or the link may have expired.
          </p>
          <div>
            <Link
              to="/promotions"
              className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest bg-[#c5a880] text-stone-950 rounded-xs hover:bg-[#dfc282] transition-colors"
            >
              &larr; Return to All Offers
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  if (errorStatus) {
    return (
      <div className="py-24 bg-[#0c0a09]">
        <Container>
          <ErrorState
            title="Unable to load offer details"
            message="We encountered an issue retrieving the details for this promotion. Please try again."
            onRetry={handleRetry}
          />
        </Container>
      </div>
    );
  }

  if (!promotion) {
    return null;
  }

  const hasValidity = promotion.valid_from || promotion.valid_until;

  return (
    <div className="flex flex-col">
      {/* 1. BREADCRUMB NAVIGATION */}
      <nav aria-label="Breadcrumb" className="bg-[#100e0c] border-b border-[#c5a880]/20 py-3">
        <Container>
          <ol className="flex items-center space-x-2 text-xs text-stone-400">
            <li>
              <Link to="/" className="hover:text-[#dfc282] transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-stone-600">/</li>
            <li>
              <Link to="/promotions" className="hover:text-[#dfc282] transition-colors">
                Offers
              </Link>
            </li>
            <li aria-hidden="true" className="text-stone-600">/</li>
            <li className="text-stone-200 font-medium truncate max-w-xs sm:max-w-md">
              {promotion.title}
            </li>
          </ol>
        </Container>
      </nav>

      {/* 2. PROMOTION CONTENT */}
      <article className="py-12 sm:py-20 bg-[#0c0a09]">
        <Container>
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Header info */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#dfc282] bg-[#1a1714] px-2.5 py-1 rounded-xs border border-[#c5a880]/30">
                  Exclusive Privilege
                </span>
                {hasValidity && (
                  <span className="text-xs text-stone-400 font-mono">
                    {promotion.valid_from && `From ${promotion.valid_from} `}
                    {promotion.valid_until && `Until ${promotion.valid_until}`}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-stone-100 tracking-tight leading-tight">
                {promotion.title}
              </h1>

              {promotion.short_description && (
                <p className="text-lg text-stone-300 font-light leading-relaxed">
                  {promotion.short_description}
                </p>
              )}
            </div>

            {/* Banner image if available */}
            {promotion.image && (
              <div className="aspect-16/9 overflow-hidden rounded-xs bg-stone-900 border border-[#c5a880]/20">
                <img
                  src={promotion.image}
                  alt={promotion.title}
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Detailed Description */}
            <div className="bg-[#141210] border border-[#c5a880]/30 rounded-xs p-8 sm:p-12 space-y-6 shadow-2xl">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-[#c5a880] pb-2 border-b border-stone-800">
                Package Details &amp; Terms
              </h2>

              <div className="text-base text-stone-300 leading-relaxed space-y-4 whitespace-pre-line font-light">
                {promotion.description}
              </div>
            </div>

            {/* Booking & Concierge Actions */}
            <div className="p-8 sm:p-10 bg-[#161412] text-white rounded-xs border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-semibold text-stone-100">
                  Interested in this Offer?
                </h3>
                <p className="text-xs text-stone-400 font-light">
                  Submit a reservation request or contact our concierge to personalize your experience.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 shrink-0">
                <Link
                  to="/booking"
                  className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest bg-[#c5a880] text-stone-950 rounded-xs hover:bg-[#dfc282] transition-colors focus-visible:outline-2 focus-visible:outline-[#c5a880]"
                >
                  Request Booking
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest border border-[#c5a880]/40 text-[#c5a880] hover:bg-[#181614] hover:text-[#dfc282] rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-[#c5a880]"
                >
                  Contact Desk
                </Link>
              </div>
            </div>

            {/* Back link */}
            <div className="pt-4">
              <Link
                to="/promotions"
                className="inline-flex items-center text-xs font-medium uppercase tracking-widest text-[#c5a880] hover:text-[#dfc282] transition-colors"
              >
                &larr; Back to All Special Offers
              </Link>
            </div>
          </div>
        </Container>
      </article>
    </div>
  );
}
