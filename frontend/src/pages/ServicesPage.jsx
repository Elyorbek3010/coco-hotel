import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { useLanguage } from '../hooks/useLanguage';
import { getServices } from '../api/hotel';
import Container from '../components/common/Container';
import SectionTitle from '../components/common/SectionTitle';
import ServiceIcon from '../components/common/ServiceIcon';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import RevealOnScroll from '../components/common/RevealOnScroll';

export default function ServicesPage() {
  const { t } = useLanguage();
  usePageMeta({
    title: t('meta.servicesTitle'),
    description: t('meta.servicesDesc'),
    canonicalPath: '/services',
  });

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    getServices()
      .then((data) => {
        setServices(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    getServices()
      .then((data) => {
        if (isMounted) {
          setServices(Array.isArray(data) ? data : []);
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
        aria-label="Services Header"
        className="bg-theme-secondary text-theme-main py-16 sm:py-24 border-b border-theme transition-colors duration-200"
      >
        <Container className="text-center">
          <RevealOnScroll variant="up">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-theme-gold mb-3">
              {t('services.guestAmenities')}
            </p>
            <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-theme-main tracking-tight mb-4">
              {t('services.title')}
            </h1>
            <p className="text-base sm:text-lg text-theme-muted font-light max-w-2xl mx-auto leading-relaxed">
              {t('services.intro')}
            </p>
          </RevealOnScroll>
        </Container>
      </section>

      {/* 2. SERVICES CONTENT */}
      <section aria-label="Services List" className="py-16 sm:py-24 bg-theme-main">
        <Container>
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState onRetry={handleRetry} />
          ) : services.length === 0 ? (
            <div className="text-center py-16 px-6 bg-theme-surface border border-theme rounded-xs max-w-xl mx-auto shadow-md">
              <h2 className="font-serif text-xl font-semibold text-theme-main mb-2">
                {t('services.updatingTitle')}
              </h2>
              <p className="text-sm text-theme-muted mb-6 leading-relaxed font-light">
                {t('services.updatingDesc')}
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-2.5 text-xs font-semibold uppercase tracking-widest bg-theme-gold text-stone-950 rounded-xs hover:brightness-110 transition-colors"
              >
                {t('rooms.contactConcierge')}
              </Link>
            </div>
          ) : (
            <div className="space-y-16">
              <div>
                <RevealOnScroll variant="up">
                  <SectionTitle
                    subtitle={t('services.complimentarySubtitle')}
                    title={t('services.offerTitle')}
                  />
                </RevealOnScroll>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {services.map((service, idx) => (
                    <RevealOnScroll key={service.id} variant="up" delay={idx * 60}>
                      <div
                        className="p-8 bg-theme-surface border border-theme rounded-xs hover:border-[var(--color-gold)] hover:shadow-xl transition-all duration-300 flex flex-col h-full group"
                      >
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-theme-elevated text-theme-gold border border-theme mb-5 group-hover:border-[var(--color-gold)]/40 transition-colors">
                          <ServiceIcon name={service.icon || service.name} className="w-6 h-6" />
                        </div>
                        <h3 className="font-serif text-xl font-semibold text-theme-main mb-2 group-hover:text-theme-gold transition-colors">
                          {service.name}
                        </h3>
                        {service.description ? (
                          <p className="text-sm text-theme-muted leading-relaxed font-light">
                            {service.description}
                          </p>
                        ) : (
                          <p className="text-xs text-theme-subtle italic font-light">
                            {t('rooms.defaultAmenities')}
                          </p>
                        )}
                      </div>
                    </RevealOnScroll>
                  ))}
                </div>
              </div>

              {/* Inquiry & Booking Callout */}
              <RevealOnScroll variant="up" delay={150}>
                <div className="p-8 sm:p-10 bg-theme-surface border border-theme rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl transition-colors duration-200">
                  <div className="max-w-xl space-y-2">
                    <h3 className="font-serif text-xl font-semibold text-theme-main">
                      {t('services.needSpecial')}
                    </h3>
                    <p className="text-sm text-theme-muted leading-relaxed font-light">
                      {t('services.needSpecialDesc')}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 shrink-0">
                    <Link
                      to="/booking"
                      className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest bg-theme-gold text-stone-950 rounded-xs hover:brightness-110 active:brightness-95 transition-all shadow-sm focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
                    >
                      {t('home.bookYourStay')}
                    </Link>
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest border border-theme-gold text-theme-gold hover:bg-theme-elevated rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
                    >
                      {t('rooms.contactConcierge')}
                    </Link>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
