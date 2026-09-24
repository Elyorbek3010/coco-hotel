import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHotel } from '../hooks/useHotel';
import { usePageMeta } from '../hooks/usePageMeta';
import { getFeaturedRooms } from '../api/rooms';
import { getServices, getGallery, getPromotions } from '../api/hotel';
import Container from '../components/common/Container';
import SectionTitle from '../components/common/SectionTitle';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import RoomCard from '../components/rooms/RoomCard';
import BookingSearchWidget from '../components/home/BookingSearchWidget';
import ServiceIcon from '../components/common/ServiceIcon';

export default function HomePage() {
  const { hotelInfo } = useHotel();

  const hotelName = hotelInfo?.name || 'Coco Hotel';
  usePageMeta({
    title: 'Coco Hotel',
    description:
      'Coco Hotel official website — explore rooms, hotel services and submit a booking request.',
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
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section
        aria-label="Hotel Welcome Banner"
        className="relative bg-[#0c0a09] text-white overflow-hidden py-24 sm:py-32 lg:py-40 border-b border-[#c5a880]/20"
      >
        {/* Subtle decorative background gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#0c0a09] via-[#12100e]/95 to-[#0c0a09] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#c5a880]/15 via-transparent to-transparent pointer-events-none"
          aria-hidden="true"
        />

        <Container className="relative z-10 text-center">
          <p className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-medium uppercase tracking-[0.2em] text-[#dfc282] bg-[#1a1714] border border-[#c5a880]/30 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dfc282]" />
            {heroTitle}
          </p>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-[0.08em] text-stone-100 max-w-4xl mx-auto mb-6">
            {hotelName.toUpperCase()}
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-stone-300 font-light max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            {heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/booking"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-xs font-semibold uppercase tracking-widest bg-[#c5a880] text-stone-950 rounded-xs hover:bg-[#dfc282] transition-colors shadow-lg focus-visible:outline-2 focus-visible:outline-[#c5a880] focus-visible:outline-offset-2"
            >
              Book Your Stay
            </Link>
            <Link
              to="/rooms"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#c5a880] border border-[#c5a880]/40 bg-[#141210]/60 hover:bg-[#141210] hover:text-[#dfc282] rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-[#c5a880] focus-visible:outline-offset-2"
            >
              Explore Rooms
            </Link>
          </div>
        </Container>
      </section>

      {/* 2. COMPACT BOOKING SEARCH WIDGET */}
      <section aria-label="Quick Room Availability Search" className="relative z-20 -mt-10 sm:-mt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <BookingSearchWidget />
      </section>

      {/* 3. FEATURED ROOMS SECTION */}
      <section aria-label="Featured Accommodations" className="py-20 sm:py-28 bg-[#0c0a09]">
        <Container>
          <SectionTitle
            subtitle="Accommodations"
            title="Featured Rooms &amp; Suites"
            centered
          />

          {loadingRooms ? (
            <LoadingState message="Discovering our accommodations..." />
          ) : roomsError ? (
            <ErrorState
              title="Unable to load featured rooms"
              message="Please check your connection or try again."
              onRetry={handleRetryRooms}
            />
          ) : featuredRooms.length > 0 ? (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredRooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>

              <div className="text-center pt-4">
                <Link
                  to="/rooms"
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#dfc282] bg-[#141210] hover:bg-[#1a1714] hover:text-[#f5e8cc] border border-[#c5a880]/30 rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-[#c5a880]"
                >
                  View All Rooms &amp; Suites &rarr;
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center p-12 bg-[#141210] border border-stone-800 rounded-xs max-w-xl mx-auto">
              <h3 className="font-serif text-lg font-semibold text-stone-100 mb-2">
                Accommodations Catalogue
              </h3>
              <p className="text-sm text-stone-400 mb-6 leading-relaxed">
                Our featured room selection is currently being updated. Discover our full selection of rooms and suites.
              </p>
              <Link
                to="/rooms"
                className="inline-flex items-center px-6 py-2.5 text-xs font-semibold uppercase tracking-widest bg-[#c5a880] text-stone-950 rounded-xs hover:bg-[#dfc282] transition-colors"
              >
                Browse Rooms
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* 4. ABOUT COCO HOTEL SECTION */}
      <section aria-label="About the Hotel" className="py-20 sm:py-28 bg-[#100e0c] border-y border-[#c5a880]/20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Story column */}
            <div className="lg:col-span-7 space-y-6">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#c5a880]">
                Our Sanctuary
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-stone-100 tracking-tight">
                {aboutTitle}
              </h2>
              {aboutText ? (
                <div className="text-base text-stone-300 leading-relaxed space-y-4 whitespace-pre-line font-light">
                  {aboutText}
                </div>
              ) : (
                <p className="text-base text-stone-300 leading-relaxed font-light">
                  A peaceful boutique retreat nestled in the city, offering curated accommodations, refined comfort, and authentic hospitality tailored to your journey.
                </p>
              )}
              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#dfc282] hover:text-[#f5e8cc] transition-colors focus-visible:outline-2 focus-visible:outline-[#c5a880] rounded-xs"
                >
                  Read Our Story &rarr;
                </Link>
              </div>
            </div>

            {/* Decorative showcase card */}
            <div className="lg:col-span-5">
              <div className="p-8 sm:p-10 bg-[#141210] border border-[#c5a880]/20 rounded-xs shadow-xl">
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#c5a880] block mb-2">
                  Hospitality Philosophy
                </span>
                <h3 className="font-serif text-2xl font-semibold text-stone-100 mb-4">
                  Tranquility in Every Detail
                </h3>
                <p className="text-sm text-stone-400 leading-relaxed mb-6 font-light">
                  Every space at {hotelName} is designed to provide a calm respite from the bustling city rhythm, welcoming discerning travelers with thoughtful care.
                </p>
                <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                  <span>Concierge Service</span>
                  <span>Peaceful Ambience</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. HOTEL ADVANTAGES / HIGHLIGHTS */}
      <section aria-label="Hotel Highlights" className="py-20 sm:py-24 bg-[#0c0a09]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#141210] border border-[#c5a880]/20 rounded-xs">
              <span className="text-xs font-mono font-bold text-[#c5a880] block mb-3">01</span>
              <h3 className="font-serif text-xl font-semibold text-stone-100 mb-2">
                Comfort &amp; Quiet
              </h3>
              <p className="text-sm text-stone-400 leading-relaxed font-light">
                Quiet rooms crafted for relaxation, restful sleep, and peaceful downtime after exploring the city.
              </p>
            </div>

            <div className="p-8 bg-[#141210] border border-[#c5a880]/20 rounded-xs">
              <span className="text-xs font-mono font-bold text-[#c5a880] block mb-3">02</span>
              <h3 className="font-serif text-xl font-semibold text-stone-100 mb-2">
                Convenient Stay
              </h3>
              <p className="text-sm text-stone-400 leading-relaxed font-light">
                Ideally situated for business and leisure travelers, offering effortless connectivity to local sights and transport.
              </p>
            </div>

            <div className="p-8 bg-[#141210] border border-[#c5a880]/20 rounded-xs">
              <span className="text-xs font-mono font-bold text-[#c5a880] block mb-3">03</span>
              <h3 className="font-serif text-xl font-semibold text-stone-100 mb-2">
                Guest-Focused Service
              </h3>
              <p className="text-sm text-stone-400 leading-relaxed font-light">
                A warm and attentive team available around the clock to assist with inquiries, local advice, and booking requests.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. SERVICES SECTION */}
      <section aria-label="Hotel Services" className="py-20 sm:py-28 bg-[#100e0c] border-t border-[#c5a880]/20">
        <Container>
          <SectionTitle
            subtitle="Guest Amenities"
            title="Services &amp; Experiences"
            centered
          />

          {loadingServices ? (
            <LoadingState message="Loading hotel services..." />
          ) : services.length > 0 ? (
            <div className="space-y-10">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex flex-col items-center text-center p-6 bg-[#141210] border border-stone-800 rounded-xs hover:border-[#c5a880]/50 transition-colors shadow-xs"
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1c1916] text-[#c5a880] border border-[#c5a880]/30 mb-3">
                      <ServiceIcon name={service.icon || service.name} className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-semibold text-stone-200 mb-1">
                      {service.name}
                    </h3>
                    {service.description && (
                      <p className="text-xs text-stone-400 line-clamp-2 font-light">
                        {service.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#dfc282] hover:text-[#f5e8cc] transition-colors focus-visible:outline-2 focus-visible:outline-[#c5a880] rounded-xs"
                >
                  Explore All Hotel Amenities &rarr;
                </Link>
              </div>
            </div>
          ) : null}
        </Container>
      </section>

      {/* 7. GALLERY PREVIEW */}
      <section aria-label="Photo Gallery Preview" className="py-20 sm:py-28 bg-[#0c0a09]">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#c5a880] mb-2">
                Visual Experience
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-stone-100 tracking-tight">
                Glimpse into Our Sanctuary
              </h2>
            </div>
            <Link
              to="/gallery"
              className="mt-4 sm:mt-0 text-xs font-medium uppercase tracking-widest text-[#dfc282] hover:text-[#f5e8cc] transition-colors focus-visible:outline-2 focus-visible:outline-[#c5a880] rounded-xs"
            >
              View Full Gallery &rarr;
            </Link>
          </div>

          {loadingGallery ? (
            <LoadingState message="Loading gallery preview..." />
          ) : galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-4/3 overflow-hidden bg-stone-900 rounded-xs border border-stone-800"
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
                      <span className="text-xs font-medium text-stone-200">
                        {item.title}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-[#141210] border border-stone-800 rounded-xs text-center max-w-md mx-auto">
              <p className="text-sm text-stone-400 mb-4 font-light">
                Our curated visual collection is being prepared. Explore our rooms for a preview of our interior sanctuary.
              </p>
              <Link
                to="/gallery"
                className="text-xs font-medium uppercase tracking-widest text-[#dfc282] hover:text-[#f5e8cc]"
              >
                Go to Gallery
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* 8. PROMOTIONS PREVIEW (Shown only if active promotions exist) */}
      {!loadingPromotions && promotions.length > 0 && (
        <section aria-label="Special Offers" className="py-20 sm:py-28 bg-[#100e0c] border-y border-[#c5a880]/20">
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#c5a880] mb-2">
                  Special Privileges
                </p>
                <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-stone-100 tracking-tight">
                  Exclusive Offers &amp; Packages
                </h2>
              </div>
              <Link
                to="/promotions"
                className="mt-4 sm:mt-0 text-xs font-medium uppercase tracking-widest text-[#dfc282] hover:text-[#f5e8cc]"
              >
                View All Offers &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {promotions.slice(0, 3).map((promo) => (
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
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-serif text-xl font-semibold text-stone-100 mb-2">
                      {promo.title}
                    </h3>
                    <p className="text-sm text-stone-400 line-clamp-3 mb-6 leading-relaxed font-light">
                      {promo.short_description}
                    </p>
                    <div className="mt-auto pt-4 border-t border-stone-800 flex items-center justify-between text-xs">
                      {promo.valid_until ? (
                        <span className="text-stone-400 font-light">
                          Valid until {promo.valid_until}
                        </span>
                      ) : (
                        <span className="text-[#dfc282] font-medium">Limited Availability</span>
                      )}
                      <Link
                        to="/promotions"
                        className="font-medium text-[#dfc282] hover:text-[#f5e8cc] uppercase tracking-wider text-[11px]"
                      >
                        Learn More &rarr;
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 9. LOCATION & CONTACT SECTION */}
      <section aria-label="Location and Inquiries" className="py-20 sm:py-28 bg-[#080706] text-stone-300 border-t border-stone-800">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#c5a880]">
                Location &amp; Inquiries
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-stone-100 tracking-tight">
                Plan Your Visit to {hotelName}
              </h2>
              <p className="text-sm text-stone-400 leading-relaxed max-w-lg font-light">
                Whether you have questions regarding availability, special stay arrangements, or local recommendations, our concierge desk is always here to assist.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                {hotelInfo?.phone && (
                  <a
                    href={`tel:${hotelInfo.phone}`}
                    className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest bg-[#c5a880] text-stone-950 rounded-xs hover:bg-[#dfc282] transition-colors focus-visible:outline-2 focus-visible:outline-[#c5a880]"
                  >
                    Call Concierge
                  </a>
                )}
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest border border-[#c5a880]/40 text-[#c5a880] hover:bg-[#181614] hover:text-[#dfc282] rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-[#c5a880]"
                >
                  Contact Desk
                </Link>
                {hotelInfo?.map_url && (
                  <a
                    href={hotelInfo.map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest border border-stone-700 text-stone-300 hover:bg-[#181614] hover:text-white rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-stone-500"
                  >
                    Get Directions
                  </a>
                )}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-8 bg-[#12100e] border border-[#c5a880]/20 rounded-xs space-y-6">
                {hotelInfo?.address && (
                  <div>
                    <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-[#c5a880] mb-1">
                      Address
                    </h3>
                    <p className="text-sm text-stone-200">{hotelInfo.address}</p>
                  </div>
                )}

                {(hotelInfo?.phone || hotelInfo?.secondary_phone) && (
                  <div>
                    <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-[#c5a880] mb-1">
                      Direct Telephones
                    </h3>
                    <div className="space-y-1 text-sm text-stone-200">
                      {hotelInfo?.phone && (
                        <p>
                          <a href={`tel:${hotelInfo.phone}`} className="hover:text-[#dfc282] transition-colors">
                            {hotelInfo.phone}
                          </a>
                        </p>
                      )}
                      {hotelInfo?.secondary_phone && (
                        <p className="text-stone-400 text-xs">
                          Alt: <a href={`tel:${hotelInfo.secondary_phone}`} className="hover:text-[#dfc282] transition-colors">{hotelInfo.secondary_phone}</a>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {hotelInfo?.email && (
                  <div>
                    <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-[#c5a880] mb-1">
                      Inquiries Email
                    </h3>
                    <p className="text-sm text-stone-200">
                      <a href={`mailto:${hotelInfo.email}`} className="hover:text-[#dfc282] transition-colors">
                        {hotelInfo.email}
                      </a>
                    </p>
                  </div>
                )}

                {(hotelInfo?.check_in_time || hotelInfo?.check_out_time) && (
                  <div className="pt-4 border-t border-stone-800 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-stone-400 block uppercase tracking-wider">Check-In</span>
                      <span className="text-stone-200 font-medium">{hotelInfo.check_in_time}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block uppercase tracking-wider">Check-Out</span>
                      <span className="text-stone-200 font-medium">{hotelInfo.check_out_time}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
