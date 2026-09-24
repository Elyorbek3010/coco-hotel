import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHotel } from '../hooks/useHotel';
import { usePageMeta } from '../hooks/usePageMeta';
import { useLanguage } from '../hooks/useLanguage';
import { getFeaturedRooms } from '../api/rooms';
import { getServices, getGallery, getPromotions } from '../api/hotel';
import Container from '../components/common/Container';
import SectionTitle from '../components/common/SectionTitle';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import RoomCard from '../components/rooms/RoomCard';
import BookingSearchWidget from '../components/home/BookingSearchWidget';
import ServiceIcon from '../components/common/ServiceIcon';
import RevealOnScroll from '../components/common/RevealOnScroll';

export default function HomePage() {
  const { hotelInfo } = useHotel();
  const { t } = useLanguage();

  const hotelName = hotelInfo?.name || 'Coco Hotel';
  usePageMeta({
    title: t('meta.homeTitle'),
    description: t('meta.homeDesc'),
    canonicalPath: '/',
  });

  // Dynamic sections state
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [roomsError, setRoomsError] = useState(false);

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const [galleryImages, setGalleryImages] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(true);

  const [promotions, setPromotions] = useState([]);
  const [loadingPromotions, setLoadingPromotions] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([
      getFeaturedRooms(),
      getServices(),
      getGallery(),
      getPromotions(),
    ]).then(([roomsRes, servicesRes, galleryRes, promoRes]) => {
      if (!isMounted) return;

      if (roomsRes.status === 'fulfilled') {
        setFeaturedRooms(roomsRes.value || []);
      } else {
        setRoomsError(true);
      }
      setLoadingRooms(false);

      if (servicesRes.status === 'fulfilled') {
        setServices(servicesRes.value || []);
      }
      setLoadingServices(false);

      if (galleryRes.status === 'fulfilled') {
        setGalleryImages(galleryRes.value || []);
      }
      setLoadingGallery(false);

      if (promoRes.status === 'fulfilled') {
        setPromotions(promoRes.value || []);
      }
      setLoadingPromotions(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRetryRooms = () => {
    setLoadingRooms(true);
    setRoomsError(false);
    getFeaturedRooms()
      .then((data) => {
        setFeaturedRooms(data || []);
        setLoadingRooms(false);
      })
      .catch(() => {
        setRoomsError(true);
        setLoadingRooms(false);
      });
  };

  const heroTitle = hotelInfo?.hero_title || 'Welcome to Coco Hotel';
  const heroSubtitle = hotelInfo?.hero_subtitle || 'Your Quiet Corner of the City';
  const aboutTitle = hotelInfo?.about_title || 'About Coco Hotel';
  const aboutText = hotelInfo?.about_text;

  return (
    <div className="flex flex-col bg-theme-main transition-colors duration-200">
      {/* 1. HERO SECTION */}
      <section
        aria-label="Hotel Welcome Banner"
        className="relative bg-theme-secondary text-theme-main overflow-hidden py-24 sm:py-32 lg:py-44 border-b border-theme transition-colors duration-200"
      >
        {/* Subtle decorative radial gradient */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--color-gold)]/10 via-transparent to-transparent pointer-events-none"
          aria-hidden="true"
        />

        <Container className="relative z-10 text-center">
          <RevealOnScroll variant="up">
            <p className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-theme-gold bg-theme-elevated border border-theme rounded-full mb-6 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-theme-gold" />
              {heroTitle}
            </p>
          </RevealOnScroll>

          <RevealOnScroll variant="up" delay={100}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-[0.1em] text-theme-main max-w-4xl mx-auto mb-6">
              {hotelName.toUpperCase()}
            </h1>
          </RevealOnScroll>

          <RevealOnScroll variant="up" delay={200}>
            <p className="text-lg sm:text-xl lg:text-2xl text-theme-muted font-light max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
              {heroSubtitle}
            </p>
          </RevealOnScroll>

          <RevealOnScroll variant="up" delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/booking"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-xs font-semibold uppercase tracking-widest bg-theme-gold text-stone-950 rounded-xs hover:brightness-110 active:brightness-95 transition-all shadow-lg focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
              >
                {t('home.bookYourStay')}
              </Link>
              <Link
                to="/rooms"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-theme-gold border border-theme-gold bg-theme-surface hover:bg-theme-gold hover:text-stone-950 rounded-xs transition-all focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
              >
                {t('home.exploreRooms')}
              </Link>
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      {/* 2. COMPACT BOOKING SEARCH WIDGET */}
      <section aria-label="Quick Room Availability Search" className="relative z-20 -mt-10 sm:-mt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <RevealOnScroll variant="up" delay={150}>
          <BookingSearchWidget />
        </RevealOnScroll>
      </section>

      {/* 3. FEATURED ROOMS SECTION */}
      <section aria-label="Featured Accommodations" className="py-20 sm:py-28 bg-theme-main transition-colors duration-200">
        <Container>
          <RevealOnScroll variant="up">
            <SectionTitle
              subtitle={t('home.accommodations')}
              title={t('home.featuredRooms')}
              centered
            />
          </RevealOnScroll>

          {loadingRooms ? (
            <LoadingState />
          ) : roomsError ? (
            <ErrorState
              title={t('common.errorTitle')}
              message={t('common.errorMessage')}
              onRetry={handleRetryRooms}
            />
          ) : featuredRooms.length > 0 ? (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredRooms.map((room, idx) => (
                  <RevealOnScroll key={room.id} variant="up" delay={idx * 100}>
                    <RoomCard room={room} />
                  </RevealOnScroll>
                ))}
              </div>

              <div className="text-center pt-4">
                <Link
                  to="/rooms"
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-theme-gold bg-theme-surface hover:bg-theme-elevated border border-theme rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
                >
                  {t('home.viewAllRooms')} &rarr;
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center p-12 bg-theme-surface border border-theme rounded-xs max-w-xl mx-auto shadow-md">
              <h3 className="font-serif text-lg font-semibold text-theme-main mb-2">
                {t('home.accommodations')}
              </h3>
              <p className="text-sm text-theme-muted mb-6 leading-relaxed">
                {t('booking.roomsUpdatingDesc')}
              </p>
              <Link
                to="/rooms"
                className="inline-flex items-center px-6 py-2.5 text-xs font-semibold uppercase tracking-widest bg-theme-gold text-stone-950 rounded-xs hover:brightness-110 transition-colors"
              >
                {t('home.exploreRooms')}
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* 4. ABOUT COCO HOTEL SECTION */}
      <section aria-label="About the Hotel" className="py-20 sm:py-28 bg-theme-secondary border-y border-theme transition-colors duration-200">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Story column */}
            <div className="lg:col-span-7 space-y-6">
              <RevealOnScroll variant="left">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-theme-gold">
                  {t('home.ourSanctuary')}
                </p>
                <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-theme-main tracking-tight mt-2 mb-4">
                  {aboutTitle}
                </h2>
                {aboutText ? (
                  <div className="text-base text-theme-muted leading-relaxed space-y-4 whitespace-pre-line font-light">
                    {aboutText}
                  </div>
                ) : (
                  <p className="text-base text-theme-muted leading-relaxed font-light">
                    A peaceful boutique retreat nestled in the city, offering curated accommodations, refined comfort, and authentic hospitality tailored to your journey.
                  </p>
                )}
                <div className="pt-4">
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-theme-gold hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] rounded-xs"
                  >
                    {t('home.readStory')} &rarr;
                  </Link>
                </div>
              </RevealOnScroll>
            </div>

            {/* Decorative showcase card */}
            <div className="lg:col-span-5">
              <RevealOnScroll variant="right" delay={150}>
                <div className="p-8 sm:p-10 bg-theme-surface border border-theme rounded-xs shadow-xl transition-colors duration-200">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-theme-gold block mb-2">
                    {t('home.hospitalityPhilosophy')}
                  </span>
                  <h3 className="font-serif text-2xl font-semibold text-theme-main mb-4">
                    {t('home.tranquilityDetail')}
                  </h3>
                  <p className="text-sm text-theme-muted leading-relaxed mb-6 font-light">
                    {t('home.tranquilityDetailText')}
                  </p>
                  <div className="pt-4 border-t border-theme flex items-center justify-between text-xs text-theme-muted">
                    <span className="font-medium">{t('home.conciergeService')}</span>
                    <span className="font-medium">{t('home.peacefulAmbience')}</span>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. HOTEL ADVANTAGES / HIGHLIGHTS */}
      <section aria-label="Hotel Highlights" className="py-20 sm:py-24 bg-theme-main transition-colors duration-200">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <RevealOnScroll variant="up" delay={0}>
              <div className="p-8 bg-theme-surface border border-theme rounded-xs shadow-sm hover:shadow-md transition-all duration-300">
                <span className="text-xs font-mono font-bold text-theme-gold block mb-3">01</span>
                <h3 className="font-serif text-xl font-semibold text-theme-main mb-2">
                  {t('home.highlight1Title')}
                </h3>
                <p className="text-sm text-theme-muted leading-relaxed font-light">
                  {t('home.highlight1Text')}
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll variant="up" delay={100}>
              <div className="p-8 bg-theme-surface border border-theme rounded-xs shadow-sm hover:shadow-md transition-all duration-300">
                <span className="text-xs font-mono font-bold text-theme-gold block mb-3">02</span>
                <h3 className="font-serif text-xl font-semibold text-theme-main mb-2">
                  {t('home.highlight2Title')}
                </h3>
                <p className="text-sm text-theme-muted leading-relaxed font-light">
                  {t('home.highlight2Text')}
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll variant="up" delay={200}>
              <div className="p-8 bg-theme-surface border border-theme rounded-xs shadow-sm hover:shadow-md transition-all duration-300">
                <span className="text-xs font-mono font-bold text-theme-gold block mb-3">03</span>
                <h3 className="font-serif text-xl font-semibold text-theme-main mb-2">
                  {t('home.highlight3Title')}
                </h3>
                <p className="text-sm text-theme-muted leading-relaxed font-light">
                  {t('home.highlight3Text')}
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </Container>
      </section>

      {/* 6. SERVICES SECTION */}
      <section aria-label="Hotel Services" className="py-20 sm:py-28 bg-theme-secondary border-t border-theme transition-colors duration-200">
        <Container>
          <RevealOnScroll variant="up">
            <SectionTitle
              subtitle={t('home.servicesSubtitle')}
              title={t('home.servicesTitle')}
              centered
            />
          </RevealOnScroll>

          {loadingServices ? (
            <LoadingState />
          ) : services.length > 0 ? (
            <div className="space-y-10">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                {services.map((service, idx) => (
                  <RevealOnScroll key={service.id} variant="up" delay={idx * 50}>
                    <div
                      className="flex flex-col items-center text-center p-6 bg-theme-surface border border-theme rounded-xs hover:border-[var(--color-gold)] transition-all duration-300 shadow-sm"
                    >
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-theme-elevated text-theme-gold border border-theme mb-3">
                        <ServiceIcon name={service.icon || service.name} className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-semibold text-theme-main mb-1">
                        {service.name}
                      </h3>
                      {service.description && (
                        <p className="text-xs text-theme-muted line-clamp-2 font-light">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </RevealOnScroll>
                ))}
              </div>

              <div className="text-center">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-theme-gold hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] rounded-xs"
                >
                  {t('home.exploreAllServices')} &rarr;
                </Link>
              </div>
            </div>
          ) : null}
        </Container>
      </section>

      {/* 7. GALLERY PREVIEW */}
      <section aria-label="Photo Gallery Preview" className="py-20 sm:py-28 bg-theme-main transition-colors duration-200">
        <Container>
          <RevealOnScroll variant="up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-theme-gold mb-2">
                  {t('home.gallerySubtitle')}
                </p>
                <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-theme-main tracking-tight">
                  {t('home.galleryTitle')}
                </h2>
              </div>
              <Link
                to="/gallery"
                className="mt-4 sm:mt-0 text-xs font-semibold uppercase tracking-widest text-theme-gold hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] rounded-xs"
              >
                {t('home.viewFullGallery')} &rarr;
              </Link>
            </div>
          </RevealOnScroll>

          {loadingGallery ? (
            <LoadingState />
          ) : galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.slice(0, 4).map((item, idx) => (
                <RevealOnScroll key={item.id} variant="up" delay={idx * 100}>
                  <div
                    className="group relative aspect-4/3 overflow-hidden bg-theme-elevated rounded-xs border border-theme shadow-sm"
                  >
                    <img
                      src={item.image}
                      alt={item.alt_text || item.title || 'Coco Hotel gallery view'}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.title && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="text-xs font-medium text-stone-100">
                          {item.title}
                        </span>
                      </div>
                    )}
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-theme-surface border border-theme rounded-xs text-center max-w-md mx-auto">
              <p className="text-sm text-theme-muted mb-4 font-light">
                {t('gallery.empty')}
              </p>
              <Link
                to="/gallery"
                className="text-xs font-semibold uppercase tracking-widest text-theme-gold hover:underline"
              >
                {t('home.viewFullGallery')}
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* 8. PROMOTIONS PREVIEW (Shown only if active promotions exist) */}
      {!loadingPromotions && promotions.length > 0 && (
        <section aria-label="Special Offers" className="py-20 sm:py-28 bg-theme-secondary border-y border-theme transition-colors duration-200">
          <Container>
            <RevealOnScroll variant="up">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-theme-gold mb-2">
                    {t('home.offersSubtitle')}
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-theme-main tracking-tight">
                    {t('home.offersTitle')}
                  </h2>
                </div>
                <Link
                  to="/promotions"
                  className="mt-4 sm:mt-0 text-xs font-semibold uppercase tracking-widest text-theme-gold hover:underline"
                >
                  {t('home.viewAllOffers')} &rarr;
                </Link>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {promotions.slice(0, 3).map((promo, idx) => (
                <RevealOnScroll key={promo.id} variant="up" delay={idx * 100}>
                  <article
                    className="bg-theme-surface border border-theme rounded-xs overflow-hidden shadow-md hover:shadow-xl hover:border-[var(--color-gold)] transition-all duration-300 flex flex-col"
                  >
                    {promo.image && (
                      <div className="aspect-16/9 overflow-hidden bg-theme-elevated">
                        <img
                          src={promo.image}
                          alt={promo.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-serif text-xl font-semibold text-theme-main mb-2">
                        {promo.title}
                      </h3>
                      <p className="text-sm text-theme-muted line-clamp-3 mb-6 leading-relaxed font-light">
                        {promo.short_description}
                      </p>
                      <div className="mt-auto pt-4 border-t border-theme flex items-center justify-between text-xs">
                        {promo.valid_until ? (
                          <span className="text-theme-muted font-light">
                            {t('home.validUntil')} {promo.valid_until}
                          </span>
                        ) : (
                          <span className="text-theme-gold font-medium">{t('home.limitedAvailability')}</span>
                        )}
                        <Link
                          to="/promotions"
                          className="font-semibold text-theme-gold hover:underline uppercase tracking-wider text-[11px]"
                        >
                          {t('home.learnMore')} &rarr;
                        </Link>
                      </div>
                    </div>
                  </article>
                </RevealOnScroll>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 9. LOCATION & CONTACT SECTION */}
      <section aria-label="Location and Inquiries" className="py-20 sm:py-28 bg-theme-main text-theme-muted border-t border-theme transition-colors duration-200">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <RevealOnScroll variant="left">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-theme-gold">
                  {t('home.locationSubtitle')}
                </p>
                <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-theme-main tracking-tight">
                  {t('home.planVisit')} {hotelName}
                </h2>
                <p className="text-sm text-theme-muted leading-relaxed max-w-lg font-light">
                  {t('home.locationDesc')}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  {hotelInfo?.phone && (
                    <a
                      href={`tel:${hotelInfo.phone}`}
                      className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest bg-theme-gold text-stone-950 rounded-xs hover:brightness-110 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
                    >
                      {t('home.callConcierge')}
                    </a>
                  )}
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest border border-theme-gold text-theme-gold hover:bg-theme-surface rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
                  >
                    {t('home.contactDesk')}
                  </Link>
                  {hotelInfo?.map_url && (
                    <a
                      href={hotelInfo.map_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest border border-theme text-theme-main hover:bg-theme-elevated rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
                    >
                      {t('home.getDirections')}
                    </a>
                  )}
                </div>
              </RevealOnScroll>
            </div>

            <div className="lg:col-span-6">
              <RevealOnScroll variant="right" delay={150}>
                <div className="p-8 bg-theme-surface border border-theme rounded-xs space-y-6 shadow-xl transition-colors duration-200">
                  {hotelInfo?.address && (
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-theme-gold mb-1">
                        {t('home.address')}
                      </h3>
                      <p className="text-sm text-theme-main">{hotelInfo.address}</p>
                    </div>
                  )}

                  {(hotelInfo?.phone || hotelInfo?.secondary_phone) && (
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-theme-gold mb-1">
                        {t('home.directTelephones')}
                      </h3>
                      <div className="space-y-1 text-sm text-theme-main">
                        {hotelInfo?.phone && (
                          <p>
                            <a href={`tel:${hotelInfo.phone}`} className="hover:text-theme-gold transition-colors">
                              {hotelInfo.phone}
                            </a>
                          </p>
                        )}
                        {hotelInfo?.secondary_phone && (
                          <p className="text-theme-subtle text-xs">
                            Alt: <a href={`tel:${hotelInfo.secondary_phone}`} className="hover:text-theme-gold transition-colors">{hotelInfo.secondary_phone}</a>
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {hotelInfo?.email && (
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-theme-gold mb-1">
                        {t('home.inquiriesEmail')}
                      </h3>
                      <p className="text-sm text-theme-main">
                        <a href={`mailto:${hotelInfo.email}`} className="hover:text-theme-gold transition-colors">
                          {hotelInfo.email}
                        </a>
                      </p>
                    </div>
                  )}

                  {(hotelInfo?.check_in_time || hotelInfo?.check_out_time) && (
                    <div className="pt-4 border-t border-theme grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-theme-subtle block uppercase tracking-wider">{t('booking.checkIn')}</span>
                        <span className="text-theme-main font-semibold">{hotelInfo.check_in_time}</span>
                      </div>
                      <div>
                        <span className="text-theme-subtle block uppercase tracking-wider">{t('booking.checkOut')}</span>
                        <span className="text-theme-main font-semibold">{hotelInfo.check_out_time}</span>
                      </div>
                    </div>
                  )}
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
