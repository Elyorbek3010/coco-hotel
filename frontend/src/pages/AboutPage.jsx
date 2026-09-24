import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { useHotel } from '../hooks/useHotel';
import { getGallery } from '../api/hotel';
import Container from '../components/common/Container';
import SectionTitle from '../components/common/SectionTitle';

export default function AboutPage() {
  usePageMeta({
    title: 'About',
    description: 'Learn more about Coco Hotel and your stay experience.',
    canonicalPath: '/about',
  });
  const { hotelInfo } = useHotel();
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
        // Graceful fallback: gallery absence does not break About page
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

  // Curate up to 2 showcase images for the story section if available
  const showcaseImages = galleryImages.slice(0, 2);

  return (
    <div className="flex flex-col">
      {/* 1. HERO */}
      <section
        aria-label="About Coco Hotel Header"
        className="bg-[#0c0a09] text-white py-16 sm:py-24 border-b border-[#c5a880]/20"
      >
        <Container className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#c5a880] mb-3">
            Our Philosophy
          </p>
          <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-stone-100 tracking-tight mb-4">
            {aboutTitle}
          </h1>
          <p className="text-base sm:text-lg text-stone-300 font-light max-w-2xl mx-auto leading-relaxed">
            A sanctuary in the city, founded on calm hospitality, thoughtful design, and peaceful rest.
          </p>
        </Container>
      </section>

      {/* 2. THE STORY / OVERVIEW */}
      <section aria-label="Our Story" className="py-16 sm:py-24 bg-[#0c0a09]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Story text */}
            <div className="lg:col-span-7 space-y-6">
              <SectionTitle
                subtitle="The Experience"
                title="A Quiet Corner in the City"
              />

              {aboutText ? (
                <div className="text-base text-stone-300 leading-relaxed space-y-4 whitespace-pre-line font-light">
                  {aboutText}
                </div>
              ) : (
                <div className="text-base text-stone-300 leading-relaxed space-y-4 font-light">
                  <p>
                    Nestled in a peaceful setting, {hotelName} was designed as an intimate boutique haven for travelers seeking serenity without sacrificing connection to the city.
                  </p>
                  <p>
                    From warm, attentive service to carefully chosen furnishings, every touch is intended to cultivate rest, reflection, and quiet comfort.
                  </p>
                </div>
              )}

              {/* Gallery imagery if available */}
              {showcaseImages.length > 0 && (
                <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {showcaseImages.map((img) => (
                    <div
                      key={img.id}
                      className="aspect-4/3 overflow-hidden rounded-xs bg-stone-900 border border-[#c5a880]/20"
                    >
                      <img
                        src={img.image}
                        alt={img.alt_text || img.title || `${hotelName} atmosphere`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  to="/rooms"
                  className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest bg-[#c5a880] text-stone-950 rounded-xs hover:bg-[#dfc282] transition-colors focus-visible:outline-2 focus-visible:outline-[#c5a880]"
                >
                  View Accommodations
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest border border-[#c5a880]/40 text-[#c5a880] hover:bg-[#181614] hover:text-[#dfc282] rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-[#c5a880]"
                >
                  Contact Concierge
                </Link>
              </div>
            </div>

            {/* Sanctuary values card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 sm:p-10 bg-[#141210] border border-[#c5a880]/30 rounded-xs shadow-2xl space-y-6">
                <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-[#c5a880] pb-2 border-b border-stone-800">
                  Core Essentials
                </h2>

                <div className="space-y-4 text-sm text-stone-300">
                  <div>
                    <h3 className="font-semibold text-stone-100 mb-1">Restful Spaces</h3>
                    <p className="text-xs leading-relaxed text-stone-400 font-light">
                      Comfortable bedding, quiet interior architecture, and peaceful ambience designed for restorative sleep.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-stone-100 mb-1">Attentive Hospitality</h3>
                    <p className="text-xs leading-relaxed text-stone-400 font-light">
                      Discreet and considerate assistance available around the clock to support your stay.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-stone-100 mb-1">Convenient Location</h3>
                    <p className="text-xs leading-relaxed text-stone-400 font-light">
                      Seamless access to city sights, transit, and business districts while maintaining tranquil privacy.
                    </p>
                  </div>
                </div>
              </div>

              {/* Practical stay details card */}
              {(checkInTime || checkOutTime || address) && (
                <div className="p-6 bg-[#181614] border border-stone-800 rounded-xs space-y-3 text-xs text-stone-300">
                  <h3 className="font-semibold text-stone-100 uppercase tracking-wider text-[11px]">
                    Guest Stay Details
                  </h3>
                  {address && (
                    <p className="text-stone-400 font-light">
                      <strong className="text-stone-200">Address:</strong> {address}
                    </p>
                  )}
                  {(checkInTime || checkOutTime) && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-800">
                      {checkInTime && (
                        <p>
                          <strong className="text-stone-200">Check-In:</strong> {checkInTime}
                        </p>
                      )}
                      {checkOutTime && (
                        <p>
                          <strong className="text-stone-200">Check-Out:</strong> {checkOutTime}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
