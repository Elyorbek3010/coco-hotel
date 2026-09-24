import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { getRoomBySlug } from '../api/rooms';
import { formatUZSPrice } from '../utils/formatters';
import Container from '../components/common/Container';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ServiceIcon from '../components/common/ServiceIcon';

export default function RoomDetailPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [error, setError] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Set document metadata dynamically
  const pageTitle = room ? room.name : isNotFound ? 'Room Not Found' : 'Accommodations';
  const pageDescription = room?.short_description
    ? `${room.name} at Coco Hotel — ${room.short_description}`
    : 'Discover refined accommodations and boutique comfort at Coco Hotel.';
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

  // Prepare images list (combining primary_image and images array without duplicates)
  const allImages = [];
  if (room?.images && room.images.length > 0) {
    allImages.push(...room.images);
  } else if (room?.primary_image?.image) {
    allImages.push(room.primary_image);
  }

  const currentDisplayImage = allImages[activeImageIndex] || room?.primary_image || null;

  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-[#0c0a09]">
      <Container>
        {/* BREADCRUMB / BACK LINK */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            to="/rooms"
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.15em] text-[#c5a880] hover:text-[#dfc282] transition-colors focus-visible:outline-2 focus-visible:outline-[#c5a880] rounded-xs"
          >
            <span aria-hidden="true">&larr;</span> Back to all rooms
          </Link>
        </nav>

        {/* LOADING STATE */}
        {loading && (
          <div className="py-20">
            <LoadingState message="Loading room details..." />
          </div>
        )}

        {/* 404 NOT FOUND STATE */}
        {!loading && isNotFound && (
          <div className="py-16 text-center max-w-lg mx-auto bg-[#141210] border border-stone-800 rounded-xs p-8 sm:p-12">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#c5a880] mb-2">
              404 Error
            </p>
            <h1 className="text-3xl font-serif font-semibold text-stone-100 mb-3">
              Room Not Found
            </h1>
            <p className="text-sm text-stone-400 mb-8 leading-relaxed font-light">
              This room may no longer be available, or the URL might be incorrect. Explore our complete selection of available rooms.
            </p>
            <div>
              <Link
                to="/rooms"
                className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest bg-[#c5a880] text-stone-950 rounded-xs hover:bg-[#dfc282] transition-colors"
              >
                View All Rooms
              </Link>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && !isNotFound && error && (
          <div className="py-12 max-w-lg mx-auto">
            <ErrorState
              title="Unable to load room details"
              message="We were unable to load information for this room. Please check your connection and try again."
              onRetry={fetchRoom}
            />
          </div>
        )}

        {/* VALID ROOM DETAIL CONTENT */}
        {!loading && !isNotFound && !error && room && (
          <div className="space-y-12 lg:space-y-16">
            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#c5a880]">
                  Room Details
                </span>
                {room.is_featured && (
                  <span className="bg-[#0c0a09] border border-[#c5a880]/40 text-[#dfc282] text-[10px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-xs">
                    Featured Room
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-stone-100 tracking-tight">
                {room.name}
              </h1>
            </div>

            {/* Gallery + Main Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Image Gallery Column (7 cols on lg) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Main Large Display Image */}
                <div className="relative aspect-16/10 sm:aspect-16/9 w-full bg-stone-900 rounded-xs overflow-hidden border border-[#c5a880]/20">
                  {currentDisplayImage?.image ? (
                    <img
                      src={currentDisplayImage.image}
                      alt={currentDisplayImage.alt_text || room.name}
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-500 p-8 text-center bg-stone-900">
                      <svg className="w-16 h-16 text-stone-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                      </svg>
                      <span className="text-xs uppercase tracking-widest text-stone-500">Coco Hotel Accommodation</span>
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
                            ? 'border-[#c5a880] ring-2 ring-[#c5a880]/30'
                            : 'border-stone-800 opacity-60 hover:opacity-100'
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
              </div>

              {/* Sidebar Booking & Key Specs Column (5 cols on lg) */}
              <div className="lg:col-span-5">
                <div className="sticky top-28 bg-[#141210] border border-[#c5a880]/30 rounded-xs p-6 sm:p-8 shadow-2xl space-y-6">
                  {/* Pricing */}
                  <div className="pb-6 border-b border-stone-800">
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1 font-medium">
                      Rate per Night
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
                        {formatUZSPrice(room.price_per_night)}
                      </span>
                      <span className="text-sm text-stone-400 font-normal">/ night</span>
                    </div>
                  </div>

                  {/* Room Key Specifications */}
                  <div className="grid grid-cols-2 gap-4 text-sm py-2">
                    {room.max_adults != null && (
                      <div className="flex items-start gap-2.5">
                        <svg className="w-4 h-4 text-[#c5a880] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div>
                          <span className="text-xs uppercase tracking-wider text-stone-400 block font-medium">Capacity</span>
                          <span className="font-medium text-stone-200">
                            {room.max_adults} {room.max_adults === 1 ? 'Adult' : 'Adults'}
                            {room.max_children != null && room.max_children > 0 && `, ${room.max_children} Children`}
                          </span>
                        </div>
                      </div>
                    )}

                    {room.bed_type && (
                      <div className="flex items-start gap-2.5">
                        <svg className="w-4 h-4 text-[#c5a880] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <span className="text-xs uppercase tracking-wider text-stone-400 block font-medium">Bed Type</span>
                          <span className="font-medium text-stone-200">{room.bed_type}</span>
                        </div>
                      </div>
                    )}

                    {room.room_size && (
                      <div className="flex items-start gap-2.5">
                        <svg className="w-4 h-4 text-[#c5a880] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        <div>
                          <span className="text-xs uppercase tracking-wider text-stone-400 block font-medium">Room Size</span>
                          <span className="font-medium text-stone-200">{room.room_size} m²</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Booking CTA Button */}
                  <div className="pt-4">
                    <Link
                      to={buildBookingUrl()}
                      className="w-full inline-flex items-center justify-center px-6 py-4 text-xs font-semibold uppercase tracking-widest bg-[#c5a880] text-stone-950 rounded-xs hover:bg-[#dfc282] transition-colors shadow-md focus-visible:outline-2 focus-visible:outline-[#c5a880]"
                    >
                      Book This Room
                    </Link>
                    <p className="text-center text-[11px] text-stone-400 mt-2 font-light">
                      Review details and submit a booking request to our front desk.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Description & Amenities Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8 border-t border-stone-800">
              {/* Description column */}
              <div className="lg:col-span-7 space-y-4">
                <h2 className="text-xl sm:text-2xl font-serif font-semibold text-stone-100">
                  About this Room
                </h2>
                {room.description ? (
                  <div className="text-base text-stone-300 leading-relaxed whitespace-pre-line space-y-4 font-light">
                    {room.description}
                  </div>
                ) : room.short_description ? (
                  <p className="text-base text-stone-300 leading-relaxed font-light">
                    {room.short_description}
                  </p>
                ) : (
                  <p className="text-base text-stone-300 leading-relaxed font-light">
                    A thoughtfully appointed sanctuary designed for quiet comfort and peaceful relaxation during your stay at Coco Hotel.
                  </p>
                )}
              </div>

              {/* Amenities column */}
              <div className="lg:col-span-5 space-y-4">
                <h2 className="text-xl sm:text-2xl font-serif font-semibold text-stone-100">
                  Included Amenities
                </h2>
                {room.amenities && room.amenities.length > 0 ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {room.amenities.map((amenity) => (
                      <li
                        key={amenity.id}
                        className="flex items-center gap-3 p-3 bg-[#181614] border border-[#c5a880]/20 rounded-xs text-stone-200"
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#201c18] text-[#c5a880] shrink-0 border border-[#c5a880]/30">
                          <ServiceIcon name={amenity.icon || amenity.name} className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-xs">{amenity.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-stone-400 font-light">
                    Complimentary high-speed Wi-Fi, air conditioning, and daily housekeeping are standard with all Coco Hotel accommodations.
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                to="/rooms"
                className="text-xs font-medium uppercase tracking-widest text-[#c5a880] hover:text-[#dfc282] transition-colors"
              >
                &larr; Return to All Rooms
              </Link>
              <Link
                to={buildBookingUrl()}
                className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest bg-[#c5a880] text-stone-950 rounded-xs hover:bg-[#dfc282] transition-colors shadow-sm"
              >
                Proceed to Reservation &rarr;
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
