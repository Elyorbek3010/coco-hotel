import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { getPromotions } from '../api/hotel';
import Container from '../components/common/Container';
import SectionTitle from '../components/common/SectionTitle';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';

export default function PromotionsPage() {
  usePageMeta({
    title: 'Offers',
    description: 'Explore current Coco Hotel promotions and offers.',
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
    <div className="flex flex-col">
      {/* 1. HERO HEADER */}
      <section
        aria-label="Promotions Header"
        className="bg-[#0c0a09] text-white py-16 sm:py-24 border-b border-[#c5a880]/20"
      >
        <Container className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#c5a880] mb-3">
            Special Privileges
          </p>
          <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-stone-100 tracking-tight mb-4">
            Exclusive Offers &amp; Packages
          </h1>
          <p className="text-base sm:text-lg text-stone-300 font-light max-w-2xl mx-auto leading-relaxed">
            Enhance your stay with our thoughtfully designed seasonal packages and limited-time privileges.
          </p>
        </Container>
      </section>

      {/* 2. PROMOTIONS LIST */}
      <section aria-label="Available Offers" className="py-16 sm:py-24 bg-[#0c0a09]">
        <Container>
          {loading ? (
            <LoadingState message="Checking current hotel offers..." />
          ) : error ? (
            <ErrorState
              title="Unable to load offers"
              message="We could not retrieve current promotional offers at this time. Please try again."
              onRetry={handleRetry}
            />
          ) : promotions.length === 0 ? (
            /* Polished empty state */
            <div className="text-center py-16 px-6 bg-[#141210] border border-stone-800 rounded-xs max-w-xl mx-auto space-y-4">
              <span className="inline-block p-3 rounded-full bg-[#1c1916] text-[#c5a880] border border-[#c5a880]/30">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </span>
              <h2 className="font-serif text-2xl font-semibold text-stone-100">
                No Active Offers Right Now
              </h2>
              <p className="text-sm text-stone-400 leading-relaxed max-w-md mx-auto font-light">
                We do not have any seasonal promotional packages running at this moment. Our standard room offerings and bespoke concierge services are always at your service.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/rooms"
                  className="inline-flex items-center px-6 py-2.5 text-xs font-semibold uppercase tracking-widest bg-[#c5a880] text-stone-950 rounded-xs hover:bg-[#dfc282] transition-colors"
                >
                  Browse Accommodations
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-2.5 text-xs font-semibold uppercase tracking-widest border border-[#c5a880]/40 text-[#c5a880] hover:bg-[#181614] hover:text-[#dfc282] rounded-xs transition-colors"
                >
                  Inquire with Concierge
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              <SectionTitle
                subtitle="Curated Stays"
                title="Current Privileges &amp; Experiences"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {promotions.map((promo) => (
                  <article
                    key={promo.id}
                    className="bg-[#141210] border border-[#c5a880]/20 rounded-xs overflow-hidden shadow-lg hover:border-[#c5a880]/50 transition-all flex flex-col"
                  >
                    {promo.image && (
                      <div className="aspect-16/9 overflow-hidden bg-stone-900">
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
                      <h2 className="font-serif text-xl font-semibold text-stone-100 mb-2">
                        {promo.title}
                      </h2>
                      <p className="text-sm text-stone-400 leading-relaxed mb-6 line-clamp-3 font-light">
                        {promo.short_description}
                      </p>

                      <div className="mt-auto pt-4 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="text-stone-400 font-light">
                          {promo.valid_until ? (
                            <span>Valid until {promo.valid_until}</span>
                          ) : promo.valid_from ? (
                            <span>Available from {promo.valid_from}</span>
                          ) : (
                            <span className="text-[#dfc282] font-medium">Limited Availability</span>
                          )}
                        </div>
                        <Link
                          to={`/promotions/${promo.slug}`}
                          className="font-medium text-[#dfc282] hover:text-[#f5e8cc] self-start sm:self-auto inline-flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-[#c5a880] rounded-xs uppercase tracking-wider text-[11px]"
                        >
                          View Details &rarr;
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
