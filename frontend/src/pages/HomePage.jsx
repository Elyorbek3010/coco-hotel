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
import GoldWavePattern from '../components/common/GoldWavePattern';

export default function HomePage() {
  const { hotelInfo } = useHotel();
  const { language, t } = useLanguage();

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
  }, [language]);

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

  const heroSubtitle = hotelInfo?.hero_subtitle || 'Elegant rooms. Exceptional service. Unforgettable moments.';
  const aboutTitle = hotelInfo?.about_title || 'About Coco Hotel';
  const aboutText = hotelInfo?.about_text;

  return (
    <div className="flex flex-col bg-theme-main transition-colors duration-200">
      {/* 1. HERO SECTION (Split composition with real illuminated Coco Hotel exterior & wave ribbons) */}
      <section
        aria-label="Hotel Welcome Banner"
        className="relative bg-theme-secondary text-theme-main overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-36 border-b border-theme transition-colors duration-200"
      >
        {/* Subtle decorative gold wave-line pattern */}
        <GoldWavePattern variant="hero" className="opacity-35 pointer-events-none" />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Bold luxury editorial typography & call to action */}
            <div className="lg:col-span-6 text-left space-y-6">
              <RevealOnScroll variant="up">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-theme-gold bg-theme-elevated/90 border border-[var(--color-gold-border)] rounded-full backdrop-blur-xs shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-theme-gold" />
                  COCO HOTEL · TASHKENT
                </div>
              </RevealOnScroll>

              <RevealOnScroll variant="up" delay={100}>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-theme-main leading-[1.08]">
                  A Place Beyond Stay
                </h1>
              </RevealOnScroll>

              <RevealOnScroll variant="up" delay={200}>
                <p className="text-base sm:text-lg lg:text-xl text-theme-muted font-light max-w-xl leading-relaxed font-sans">
                  {heroSubtitle}
                </p>
              </RevealOnScroll>

              <RevealOnScroll variant="up" delay={300}>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    to="/booking"
                    className="inline-flex items-center justify-center px-8 py-3.5 text-xs font-bold uppercase tracking-widest bg-gold-metallic gold-glow text-stone-950 rounded-full hover:brightness-110 active:scale-[0.98] transition-all shadow-lg focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
                  >
                    {t('home.bookYourStay')} &rarr;
                  </Link>
                  <Link
                    to="/rooms"
                    className="inline-flex items-center justify-center px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-theme-gold border border-[var(--color-gold)] bg-theme-surface/70 hover:bg-theme-elevated rounded-full transition-all focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
                  >
                    {t('home.exploreRooms')}
                  </Link>
                </div>
              </RevealOnScroll>
            </div>

            {/* Right Column: High-End Twilight Exterior Photography with ambient gold glow */}
            <div className="lg:col-span-6">
              <RevealOnScroll variant="fade" delay={200}>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[var(--color-gold-border)] group">
                  <img
                    src="/images/hero_exterior.jpg"
                    alt="Coco Hotel Luxury Architecture at Twilight"
                    className="w-full h-80 sm:h-96 lg:h-[450px] object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90 px-4 py-2.5 bg-black/50 backdrop-blur-md rounded-2xl border border-white/10">
                    <span className="font-serif tracking-wider font-semibold">COCO HOTEL FAÇADE</span>
                    <span className="text-[10px] uppercase tracking-widest text-amber-300 font-semibold">Tashkent, Uzbekistan</span>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. COMPACT BOOKING SEARCH WIDGET */}
      <section aria-label="Quick Room Availability Search" className="relative z-20 -mt-8 sm:-mt-12 lg:-mt-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
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

      {/* 4. ABOUT COCO HOTEL SECTION (Split layout matching reference with lobby photo) */}
      <section aria-label="About the Hotel" className="relative py-20 sm:py-28 bg-theme-secondary border-y border-theme overflow-hidden transition-colors duration-200">
        <GoldWavePattern variant="top-right" className="opacity-20 pointer-events-none" />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Story column */}
            <div className="lg:col-span-6 space-y-6">
              <RevealOnScroll variant="left">
                <p className="font-serif italic text-lg sm:text-xl text-theme-gold">
                  Where comfort meets elegance
                </p>
                <h2 className="text-3xl sm:text-5xl font-serif font-bold text-theme-main tracking-tight mt-1 mb-4">
                  {aboutTitle}
                </h2>
                {aboutText ? (
                  <div className="text-base text-theme-muted leading-relaxed space-y-4 whitespace-pre-line font-light">
                    {aboutText}
                  </div>
                ) : (
                  <p className="text-base text-theme-muted leading-relaxed font-light">
                    Coco Hotel is a modern boutique hotel offering a perfect blend of luxury, comfort, and genuine hospitality. Our mission is to create unforgettable experiences for every guest.
                  </p>
                )}
                <div className="pt-4">
                  <Link
                    to="/about"
                    className="inline-flex items-center justify-center px-7 py-3 text-xs font-bold uppercase tracking-widest bg-gold-metallic gold-glow text-stone-950 rounded-full hover:brightness-110 active:scale-[0.98] transition-all shadow-md focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
                  >
                    {t('home.readStory')} &rarr;
                  </Link>
                </div>
              </RevealOnScroll>
            </div>

            {/* Right column: Grand Luxury Hotel Lobby Visual */}
            <div className="lg:col-span-6">
              <RevealOnScroll variant="right" delay={150}>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[var(--color-gold-border)] group">
                  <img
                    src="/images/hotel_lobby.jpg"
                    alt="Coco Hotel Grand Lobby & Lounge"
                    className="w-full h-80 sm:h-96 lg:h-[400px] object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90 px-4 py-2 bg-black/50 backdrop-blur-md rounded-2xl border border-white/10">
                    <span className="font-serif tracking-wider font-semibold">LOBBY & CONCIERGE LOUNGE</span>
                    <span className="text-[10px] uppercase tracking-widest text-amber-300 font-semibold">Coco Hotel</span>
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
              <div className="p-8 bg-theme-surface border border-theme rounded-2xl shadow-md hover:shadow-xl hover:border-[var(--color-gold-border)] transition-all duration-300">
                <span className="text-sm font-serif font-bold text-theme-gold block mb-3">01</span>
                <h3 className="font-serif text-xl font-bold text-theme-main mb-2">
                  {t('home.highlight1Title')}
                </h3>
                <p className="text-sm text-theme-muted leading-relaxed font-light">
                  {t('home.highlight1Text')}
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll variant="up" delay={100}>
              <div className="p-8 bg-theme-surface border border-theme rounded-2xl shadow-md hover:shadow-xl hover:border-[var(--color-gold-border)] transition-all duration-300">
                <span className="text-sm font-serif font-bold text-theme-gold block mb-3">02</span>
                <h3 className="font-serif text-xl font-bold text-theme-main mb-2">
                  {t('home.highlight2Title')}
                </h3>
                <p className="text-sm text-theme-muted leading-relaxed font-light">
                  {t('home.highlight2Text')}
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll variant="up" delay={200}>
              <div className="p-8 bg-theme-surface border border-theme rounded-2xl shadow-md hover:shadow-xl hover:border-[var(--color-gold-border)] transition-all duration-300">
                <span className="text-sm font-serif font-bold text-theme-gold block mb-3">03</span>
                <h3 className="font-serif text-xl font-bold text-theme-main mb-2">
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
                      className="flex flex-col items-center text-center p-6 bg-theme-surface border border-theme rounded-2xl hover:border-[var(--color-gold)] hover:shadow-xl hover:shadow-[var(--color-gold)]/10 transition-all duration-300 shadow-md group"
                    >
                      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-theme-elevated text-theme-gold border border-[var(--color-gold-border)] mb-3 group-hover:scale-110 transition-transform duration-300">
                        <ServiceIcon name={service.icon || service.name} className="w-7 h-7" />
                      </div>
                      <h3 className="text-sm font-bold text-theme-main mb-1">
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
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-theme-gold hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] rounded-xs"
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
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-theme-gold mb-2">
                  {t('home.gallerySubtitle')}
                </p>
                <h2 className="text-3xl sm:text-5xl font-serif font-bold text-theme-main tracking-tight">
                  {t('home.galleryTitle')}
                </h2>
              </div>
              <Link
                to="/gallery"
                className="mt-4 sm:mt-0 text-xs font-bold uppercase tracking-widest text-theme-gold hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] rounded-xs"
              >
                {t('home.viewFullGallery')} &rarr;
              </Link>
            </div>
          </RevealOnScroll>

          {loadingGallery ? (
            <LoadingState />
          ) : galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {galleryImages.slice(0, 4).map((item, idx) => {
                const fallbackImg = ['/images/hotel_lobby.jpg', '/images/hotel_dining.jpg', '/images/hotel_lounge.jpg', '/images/hotel_details.jpg'][idx % 4];
                const displayImg = item.image && !item.image.includes('std_') ? item.image : fallbackImg;
                return (
                  <RevealOnScroll key={item.id || idx} variant="up" delay={idx * 100}>
                    <div
                      className="group relative aspect-4/3 overflow-hidden bg-theme-elevated rounded-2xl border border-theme hover:border-[var(--color-gold)] shadow-md hover:shadow-2xl transition-all duration-300"
                    >
                      <img
                        src={displayImg}
                        alt={item.alt_text || item.title || 'Coco Hotel gallery view'}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="text-xs font-serif font-bold text-white tracking-wider">
                          {item.title || 'Coco Hotel Experience'}
                        </span>
                      </div>
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>
          ) : (
            <div className="p-8 bg-theme-surface border border-theme rounded-2xl text-center max-w-md mx-auto shadow-md">
              <p className="text-sm text-theme-muted mb-4 font-light">
                {t('gallery.empty')}
              </p>
              <Link
                to="/gallery"
                className="text-xs font-bold uppercase tracking-widest text-theme-gold hover:underline"
              >
                {t('home.viewFullGallery')}
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* 8. PROMOTIONS PREVIEW (Shown only if active promotions exist) */}
      {!loadingPromotions && promotions.length > 0 && (
        <section aria-label="Special Offers" className="relative py-20 sm:py-28 bg-theme-secondary border-y border-theme overflow-hidden transition-colors duration-200">
          <GoldWavePattern variant="top-right" className="opacity-15 pointer-events-none" />

          <Container className="relative z-10">
            <RevealOnScroll variant="up">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-theme-gold mb-2">
                    {t('home.offersSubtitle')}
                  </p>
                  <h2 className="text-3xl sm:text-5xl font-serif font-bold text-theme-main tracking-tight">
                    {t('home.offersTitle')}
                  </h2>
                </div>
                <Link
                  to="/promotions"
                  className="mt-4 sm:mt-0 text-xs font-bold uppercase tracking-widest text-theme-gold hover:underline"
                >
                  {t('home.viewAllOffers')} &rarr;
                </Link>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {promotions.slice(0, 3).map((promo, idx) => {
                const fallbackPromoImg = idx % 2 === 0 ? '/images/room_deluxe.jpg' : '/images/hotel_dining.jpg';
                const promoImg = promo.image && !promo.image.includes('std_') ? promo.image : fallbackPromoImg;

                return (
                  <RevealOnScroll key={promo.id || idx} variant="up" delay={idx * 100}>
                    <article
                      className="bg-theme-surface border border-theme rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-[var(--color-gold)] transition-all duration-300 flex flex-col group"
                    >
                      <div className="aspect-16/9 overflow-hidden bg-theme-elevated relative">
                        <img
                          src={promoImg}
                          alt={promo.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <span className="absolute top-3.5 left-3.5 bg-stone-950/80 border border-[var(--color-gold)] text-theme-gold text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-xs shadow-md">
                          Special Offer
                        </span>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="font-serif text-xl font-bold text-theme-main mb-2 group-hover:text-theme-gold transition-colors">
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
                            <span className="text-theme-gold font-bold">{t('home.limitedAvailability')}</span>
                          )}
                          <Link
                            to="/promotions"
                            className="inline-flex items-center px-4 py-2 text-xs font-bold uppercase tracking-widest bg-gold-metallic gold-glow text-stone-950 rounded-full hover:brightness-110 transition-all shadow-sm"
                          >
                            {t('home.learnMore')} &rarr;
                          </Link>
                        </div>
                      </div>
                    </article>
                  </RevealOnScroll>
                );
              })}
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
