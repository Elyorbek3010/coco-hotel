import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { useLanguage } from '../hooks/useLanguage';
import { getRoomBySlug } from '../api/rooms';
import { formatUZSPrice } from '../utils/formatters';
import Container from '../components/common/Container';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ServiceIcon from '../components/common/ServiceIcon';
import RevealOnScroll from '../components/common/RevealOnScroll';

export default function RoomDetailPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [error, setError] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Set document metadata dynamically
  const pageTitle = room ? room.name : isNotFound ? t('rooms.roomNotFound') : t('nav.rooms');
  const pageDescription = room?.short_description
    ? `${room.name} — ${room.short_description}`
    : t('meta.roomsDesc');
  usePageMeta({
    title: pageTitle,
    description: pageDescription,
    canonicalPath: `/rooms/${slug}`,
  });

  const fetchRoom = () => {
    setLoading(true);
    setError(false);
    setIsNotFound(false);

    getRoomBySlug(slug)
      .then((data) => {
        setRoom(data);
        setActiveImageIndex(0);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setIsNotFound(true);
        } else {
          setError(true);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;

    getRoomBySlug(slug)
      .then((data) => {
        if (isMounted) {
          setRoom(data);
          setActiveImageIndex(0);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          if (err.response && err.response.status === 404) {
            setIsNotFound(true);
          } else {
            setError(true);
          }
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Build booking URL preserving incoming search parameters
  const buildBookingUrl = () => {
    if (!room) return '/booking';
    const params = new URLSearchParams(searchParams);
    params.set('room', String(room.id));
    return `/booking?${params.toString()}`;
  };

  // Prepare images list
  const allImages = [];
  if (room?.images && room.images.length > 0) {
    allImages.push(...room.images);
  } else if (room?.primary_image?.image) {
    allImages.push(room.primary_image);
  }

  const currentDisplayImage = allImages[activeImageIndex] || room?.primary_image || null;

  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-theme-main transition-colors duration-200">
      <Container>
        {/* BREADCRUMB / BACK LINK */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            to="/rooms"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-theme-gold hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] rounded-xs"
          >
            <span aria-hidden="true">&larr;</span> {t('rooms.backToRooms')}
          </Link>
        </nav>

        {/* LOADING STATE */}
        {loading && (
          <div className="py-20">
            <LoadingState />
          </div>
        )}

        {/* 404 NOT FOUND STATE */}
        {!loading && isNotFound && (
          <div className="py-16 text-center max-w-lg mx-auto bg-theme-surface border border-theme rounded-xs p-8 sm:p-12 shadow-md">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-theme-gold mb-2">
              404
            </p>
            <h1 className="text-3xl font-serif font-semibold text-theme-main mb-3">
              {t('rooms.roomNotFound')}
            </h1>
            <p className="text-sm text-theme-muted mb-8 leading-relaxed font-light">
              {t('rooms.roomNotFoundDesc')}
            </p>
            <div>
              <Link
                to="/rooms"
                className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest bg-theme-gold text-stone-950 rounded-xs hover:brightness-110 transition-colors"
              >
                {t('rooms.viewAllRooms')}
              </Link>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && !isNotFound && error && (
          <div className="py-12 max-w-lg mx-auto">
            <ErrorState onRetry={fetchRoom} />
          </div>
        )}

        {/* VALID ROOM DETAIL CONTENT */}
        {!loading && !isNotFound && !error && room && (
          <div className="space-y-12 lg:space-y-16">
            {/* Header info */}
            <RevealOnScroll variant="up">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-theme-gold">
                    {t('rooms.roomDetails')}
                  </span>
                  {room.is_featured && (
                    <span className="bg-theme-elevated border border-theme-gold text-theme-gold text-[10px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-xs">
                      {t('rooms.featured')}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-theme-main tracking-tight">
                  {room.name}
                </h1>
              </div>
            </RevealOnScroll>

            {/* Gallery + Main Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Image Gallery Column (7 cols on lg) */}
              <div className="lg:col-span-7 space-y-4">
                <RevealOnScroll variant="left">
                  <div className="relative aspect-16/10 sm:aspect-16/9 w-full bg-theme-elevated rounded-xs overflow-hidden border border-theme shadow-lg">
                    {currentDisplayImage?.image ? (
                      <img
                        src={currentDisplayImage.image}
                        alt={currentDisplayImage.alt_text || room.name}
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-theme-subtle p-8 text-center bg-theme-elevated">
                        <svg className="w-16 h-16 opacity-30 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        <span className="text-xs uppercase tracking-widest text-theme-subtle">Coco Hotel Accommodation</span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnails row if multiple images exist */}
                  {allImages.length > 1 && (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 pt-2">
                      {allImages.map((img, idx) => (
                        <button
                          key={img.id || idx}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          aria-label={`View photo ${idx + 1} of ${room.name}`}
                          className={`aspect-4/3 overflow-hidden rounded-xs border-2 transition-all cursor-pointer ${
                            activeImageIndex === idx
                              ? 'border-theme-gold ring-2 ring-[var(--color-gold)]/30'
                              : 'border-theme opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img.image}
                            alt={img.alt_text || `${room.name} thumbnail ${idx + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </RevealOnScroll>
              </div>

              {/* Sidebar Booking & Key Specs Column (5 cols on lg) */}
              <div className="lg:col-span-5">
                <RevealOnScroll variant="right" delay={150}>
                  <div className="sticky top-28 bg-theme-surface border border-theme rounded-xs p-6 sm:p-8 shadow-2xl space-y-6 transition-colors duration-200">
                    {/* Pricing */}
                    <div className="pb-6 border-b border-theme">
                      <span className="text-[10px] uppercase tracking-widest text-theme-subtle block mb-1 font-medium">
                        {t('rooms.ratePerNight')}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-serif font-bold text-theme-main">
                          {formatUZSPrice(room.price_per_night)}
                        </span>
                        <span className="text-sm text-theme-muted font-normal">/ {t('rooms.perNight')}</span>
                      </div>
                    </div>

                    {/* Room Key Specifications */}
                    <div className="grid grid-cols-2 gap-4 text-sm py-2">
                      {room.max_adults != null && (
                        <div className="flex items-start gap-2.5">
                          <svg className="w-4 h-4 text-theme-gold mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <div>
                            <span className="text-xs uppercase tracking-wider text-theme-subtle block font-medium">{t('rooms.capacity')}</span>
                            <span className="font-medium text-theme-main">
                              {room.max_adults} {room.max_adults === 1 ? t('booking.adult') : t('booking.adultsPlural')}
                              {room.max_children != null && room.max_children > 0 && `, ${room.max_children} ${t('booking.childrenPlural')}`}
                            </span>
                          </div>
                        </div>
                      )}

                      {room.bed_type && (
                        <div className="flex items-start gap-2.5">
                          <svg className="w-4 h-4 text-theme-gold mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <span className="text-xs uppercase tracking-wider text-theme-subtle block font-medium">{t('rooms.bedType')}</span>
                            <span className="font-medium text-theme-main">{room.bed_type}</span>
                          </div>
                        </div>
                      )}

                      {room.room_size && (
                        <div className="flex items-start gap-2.5">
                          <svg className="w-4 h-4 text-theme-gold mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                          <div>
                            <span className="text-xs uppercase tracking-wider text-theme-subtle block font-medium">{t('rooms.roomSize')}</span>
                            <span className="font-medium text-theme-main">{room.room_size} m²</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Booking CTA Button */}
                    <div className="pt-4">
                      <Link
                        to={buildBookingUrl()}
                        className="w-full inline-flex items-center justify-center px-6 py-4 text-xs font-semibold uppercase tracking-widest bg-theme-gold text-stone-950 rounded-xs hover:brightness-110 active:brightness-95 transition-all shadow-md focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
                      >
                        {t('rooms.bookThisRoom')}
                      </Link>
                      <p className="text-center text-[11px] text-theme-muted mt-2 font-light">
                        {t('rooms.bookingReviewNote')}
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>
            </div>

            {/* Room Description & Amenities Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8 border-t border-theme">
              {/* Description column */}
              <div className="lg:col-span-7 space-y-4">
                <RevealOnScroll variant="up">
                  <h2 className="text-xl sm:text-2xl font-serif font-semibold text-theme-main">
                    {t('rooms.aboutRoom')}
                  </h2>
                  {room.description ? (
                    <div className="text-base text-theme-muted leading-relaxed whitespace-pre-line space-y-4 font-light">
                      {room.description}
                    </div>
                  ) : room.short_description ? (
                    <p className="text-base text-theme-muted leading-relaxed font-light">
                      {room.short_description}
                    </p>
                  ) : (
                    <p className="text-base text-theme-muted leading-relaxed font-light">
                      {t('rooms.desc')}
                    </p>
                  )}
                </RevealOnScroll>
              </div>

              {/* Amenities column */}
              <div className="lg:col-span-5 space-y-4">
                <RevealOnScroll variant="up" delay={150}>
                  <h2 className="text-xl sm:text-2xl font-serif font-semibold text-theme-main">
                    {t('rooms.includedAmenities')}
                  </h2>
                  {room.amenities && room.amenities.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {room.amenities.map((amenity) => (
                        <li
                          key={amenity.id}
                          className="flex items-center gap-3 p-3 bg-theme-elevated border border-theme rounded-xs text-theme-main"
                        >
                          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-theme-surface text-theme-gold shrink-0 border border-theme">
                            <ServiceIcon name={amenity.icon || amenity.name} className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-xs">{amenity.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-theme-muted font-light">
                      {t('rooms.defaultAmenities')}
                    </p>
                  )}
                </RevealOnScroll>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="pt-8 border-t border-theme flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                to="/rooms"
                className="text-xs font-semibold uppercase tracking-widest text-theme-gold hover:underline transition-colors"
              >
                &larr; {t('rooms.returnToRooms')}
              </Link>
              <Link
                to={buildBookingUrl()}
                className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest bg-theme-gold text-stone-950 rounded-xs hover:brightness-110 transition-colors shadow-sm"
              >
                {t('rooms.proceedToReservation')} &rarr;
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
