import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { useHotel } from '../hooks/useHotel';
import { useLanguage } from '../hooks/useLanguage';
import { getGallery } from '../api/hotel';
import Container from '../components/common/Container';
import SectionTitle from '../components/common/SectionTitle';
import RevealOnScroll from '../components/common/RevealOnScroll';

export default function AboutPage() {
  const { hotelInfo } = useHotel();
  const { t } = useLanguage();

  usePageMeta({
    title: t('meta.aboutTitle'),
    description: t('meta.aboutDesc'),
    canonicalPath: '/about',
  });

  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    let isMounted = true;
    getGallery()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setGalleryImages(data);
        }
      })
      .catch(() => {
        // Graceful fallback
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const hotelName = hotelInfo?.name || 'Coco Hotel';
  const aboutTitle = hotelInfo?.about_title || 'About Coco Hotel';
  const aboutText = hotelInfo?.about_text;
  const address = hotelInfo?.address;
  const checkInTime = hotelInfo?.check_in_time;
  const checkOutTime = hotelInfo?.check_out_time;

  const showcaseImages = galleryImages.slice(0, 2);

  return (
    <div className="flex flex-col bg-theme-main transition-colors duration-200">
      {/* 1. HERO */}
      <section
        aria-label="About Coco Hotel Header"
        className="bg-theme-secondary text-theme-main py-16 sm:py-24 border-b border-theme transition-colors duration-200"
      >
        <Container className="text-center">
          <RevealOnScroll variant="up">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-theme-gold mb-3">
              {t('about.ourPhilosophy')}
            </p>
            <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-theme-main tracking-tight mb-4">
              {aboutTitle}
            </h1>
            <p className="text-base sm:text-lg text-theme-muted font-light max-w-2xl mx-auto leading-relaxed">
              {t('about.tagline')}
            </p>
          </RevealOnScroll>
        </Container>
      </section>

      {/* 2. EDITORIAL QUOTE BLOCK (Visual Variety) */}
      <section className="py-12 bg-theme-main border-b border-theme">
        <Container>
          <RevealOnScroll variant="fade">
            <div className="max-w-3xl mx-auto text-center px-4 py-8 border-y border-theme-gold">
              <span className="font-serif text-3xl sm:text-4xl text-theme-gold block mb-2">&ldquo;</span>
              <p className="font-serif text-xl sm:text-2xl text-theme-main italic leading-relaxed">
                {t('home.tranquilityDetailText')}
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="h-px w-8 bg-theme-gold" />
                <span className="text-xs uppercase tracking-widest text-theme-gold font-semibold">{hotelName}</span>
                <span className="h-px w-8 bg-theme-gold" />
              </div>
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      {/* 3. THE STORY / OVERVIEW */}
      <section aria-label="Our Story" className="py-16 sm:py-24 bg-theme-main">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Story text */}
            <div className="lg:col-span-7 space-y-6">
              <RevealOnScroll variant="left">
                <SectionTitle
                  subtitle={t('about.theExperience')}
                  title={t('about.quietCornerTitle')}
                />

                {aboutText ? (
                  <div className="text-base text-theme-muted leading-relaxed space-y-4 whitespace-pre-line font-light">
                    {aboutText}
                  </div>
                ) : (
                  <div className="text-base text-theme-muted leading-relaxed space-y-4 font-light">
                    <p>
                      {t('about.p1')}
                    </p>
                    <p>
                      {t('about.p2')}
                    </p>
                  </div>
                )}

                {/* Gallery imagery if available */}
                {showcaseImages.length > 0 && (
                  <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {showcaseImages.map((img) => (
                      <div
                        key={img.id}
                        className="aspect-4/3 overflow-hidden rounded-xs bg-theme-elevated border border-theme shadow-md group"
                      >
                        <img
                          src={img.image}
                          alt={img.alt_text || img.title || `${hotelName} atmosphere`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-4 flex flex-wrap gap-4">
                  <Link
                    to="/rooms"
                    className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest bg-theme-gold text-stone-950 rounded-xs hover:brightness-110 active:brightness-95 transition-all shadow-sm focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
                  >
                    {t('about.viewAccommodations')}
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest border border-theme-gold text-theme-gold hover:bg-theme-surface rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
                  >
                    {t('about.contactConcierge')}
                  </Link>
                </div>
              </RevealOnScroll>
            </div>

            {/* Sanctuary values card */}
            <div className="lg:col-span-5 space-y-6">
              <RevealOnScroll variant="right" delay={150}>
                <div className="p-8 sm:p-10 bg-theme-surface border border-theme rounded-xs shadow-2xl space-y-6 transition-colors duration-200">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-theme-gold pb-2 border-b border-theme">
                    {t('about.coreEssentials')}
                  </h2>

                  <div className="space-y-4 text-sm text-theme-muted">
                    <div>
                      <h3 className="font-semibold text-theme-main mb-1">{t('about.restfulSpacesTitle')}</h3>
                      <p className="text-xs leading-relaxed text-theme-muted font-light">
                        {t('about.restfulSpacesDesc')}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-theme-main mb-1">{t('about.attentiveHospitalityTitle')}</h3>
                      <p className="text-xs leading-relaxed text-theme-muted font-light">
                        {t('about.attentiveHospitalityDesc')}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-theme-main mb-1">{t('about.convenientLocationTitle')}</h3>
                      <p className="text-xs leading-relaxed text-theme-muted font-light">
                        {t('about.convenientLocationDesc')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Practical stay details card */}
                {(checkInTime || checkOutTime || address) && (
                  <div className="p-6 bg-theme-elevated border border-theme rounded-xs space-y-3 text-xs text-theme-muted mt-6 transition-colors duration-200">
                    <h3 className="font-semibold text-theme-main uppercase tracking-wider text-[11px]">
                      {t('about.guestStayDetails')}
                    </h3>
                    {address && (
                      <p className="text-theme-muted font-light">
                        <strong className="text-theme-main">{t('home.address')}:</strong> {address}
                      </p>
                    )}
                    {(checkInTime || checkOutTime) && (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-theme">
                        {checkInTime && (
                          <p>
                            <strong className="text-theme-main">{t('booking.checkIn')}:</strong> {checkInTime}
                          </p>
                        )}
                        {checkOutTime && (
                          <p>
                            <strong className="text-theme-main">{t('booking.checkOut')}:</strong> {checkOutTime}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </RevealOnScroll>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
