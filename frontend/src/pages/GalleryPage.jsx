import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { getGallery } from '../api/hotel';
import Container from '../components/common/Container';
import SectionTitle from '../components/common/SectionTitle';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';

export default function GalleryPage() {
  usePageMeta({
    title: 'Gallery',
    description: 'View Coco Hotel rooms and property photography.',
    canonicalPath: '/gallery',
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [brokenIds, setBrokenIds] = useState(() => new Set());

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    getGallery()
      .then((data) => {
        setImages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    getGallery()
      .then((data) => {
        if (isMounted) {
          setImages(Array.isArray(data) ? data : []);
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

  const handleImageError = (id) => {
    setBrokenIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const visibleImages = images.filter((img) => !brokenIds.has(img.id));

  return (
    <div className="flex flex-col">
      {/* 1. HERO HEADER */}
      <section
        aria-label="Gallery Header"
        className="bg-stone-900 text-white py-16 sm:py-24 border-b border-stone-800"
      >
        <Container className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-3">
            Visual Experience
          </p>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight mb-4">
            Photo Gallery
          </h1>
          <p className="text-base sm:text-lg text-stone-300 font-light max-w-2xl mx-auto leading-relaxed">
            Immerse yourself in images capturing the serene architecture, warm hospitality, and peaceful spaces of Coco Hotel.
          </p>
        </Container>
      </section>

      {/* 2. GALLERY GRID */}
      <section aria-label="Hotel Photographs" className="py-16 sm:py-24">
        <Container>
          {loading ? (
            <LoadingState message="Loading hotel photo gallery..." />
          ) : error ? (
            <ErrorState
              title="Unable to load gallery"
              message="We could not load the hotel photographs at this time. Please try again."
              onRetry={handleRetry}
            />
          ) : visibleImages.length === 0 ? (
            <div className="text-center py-16 px-6 bg-stone-50 border border-stone-200 rounded-sm max-w-xl mx-auto">
              <h2 className="font-serif text-xl font-semibold text-stone-900 mb-2">
                Curating Our Collection
              </h2>
              <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                Our curated visual collection is currently being updated. Discover our accommodations for a detailed preview of our rooms and suites.
              </p>
              <Link
                to="/rooms"
                className="inline-flex items-center px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white rounded-sm hover:bg-stone-800 transition-colors"
              >
                Browse Accommodations
              </Link>
            </div>
          ) : (
            <div className="space-y-12">
              <SectionTitle
                subtitle="Hotel Moments"
                title="Moments of Rest &amp; Stillness"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {visibleImages.map((item) => (
                  <figure
                    key={item.id}
                    className="group relative overflow-hidden bg-stone-100 rounded-sm border border-stone-200 aspect-4/3 flex flex-col justify-end"
                  >
                    <img
                      src={item.image}
                      alt={item.alt_text || item.title || 'Coco Hotel sanctuary view'}
                      loading="lazy"
                      decoding="async"
                      onError={() => handleImageError(item.id)}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Gradient Overlay & Caption */}
                    {item.title && (
                      <figcaption className="relative z-10 p-4 bg-gradient-to-t from-stone-950/80 via-stone-950/40 to-transparent text-white transition-opacity duration-300">
                        <p className="text-sm font-medium tracking-wide">
                          {item.title}
                        </p>
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="pt-8 text-center border-t border-stone-200">
                <p className="text-sm text-stone-600 mb-4">
                  Ready to experience our sanctuary in person?
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    to="/rooms"
                    className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white rounded-sm hover:bg-stone-800 transition-colors"
                  >
                    Explore Rooms
                  </Link>
                  <Link
                    to="/booking"
                    className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-amber-700 text-white rounded-sm hover:bg-amber-800 transition-colors"
                  >
                    Request a Reservation
                  </Link>
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
