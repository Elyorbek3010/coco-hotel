import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { useLanguage } from '../hooks/useLanguage';
import { getGallery } from '../api/hotel';
import Container from '../components/common/Container';
import SectionTitle from '../components/common/SectionTitle';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import RevealOnScroll from '../components/common/RevealOnScroll';

export default function GalleryPage() {
  const { t } = useLanguage();
  usePageMeta({
    title: t('meta.galleryTitle'),
    description: t('meta.galleryDesc'),
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
    <div className="flex flex-col bg-theme-main transition-colors duration-200">
      {/* 1. HERO HEADER */}
      <section
        aria-label="Gallery Header"
        className="bg-theme-secondary text-theme-main py-16 sm:py-24 border-b border-theme transition-colors duration-200"
      >
        <Container className="text-center">
          <RevealOnScroll variant="up">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-theme-gold mb-3">
              {t('gallery.subtitle')}
            </p>
            <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-theme-main tracking-tight mb-4">
              {t('gallery.title')}
            </h1>
            <p className="text-base sm:text-lg text-theme-muted font-light max-w-2xl mx-auto leading-relaxed">
              {t('gallery.intro')}
            </p>
          </RevealOnScroll>
        </Container>
      </section>

      {/* 2. GALLERY GRID */}
      <section aria-label="Hotel Photographs" className="py-16 sm:py-24 bg-theme-main">
        <Container>
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState onRetry={handleRetry} />
          ) : visibleImages.length === 0 ? (
            <div className="text-center py-16 px-6 bg-theme-surface border border-theme rounded-xs max-w-xl mx-auto shadow-md">
              <h2 className="font-serif text-xl font-semibold text-theme-main mb-2">
                {t('gallery.empty')}
              </h2>
              <p className="text-sm text-theme-muted mb-6 leading-relaxed font-light">
                {t('rooms.updatingDesc')}
              </p>
              <Link
                to="/rooms"
                className="inline-flex items-center px-6 py-2.5 text-xs font-semibold uppercase tracking-widest bg-theme-gold text-stone-950 rounded-xs hover:brightness-110 transition-colors"
              >
                {t('home.exploreRooms')}
              </Link>
            </div>
          ) : (
            <div className="space-y-12">
              <RevealOnScroll variant="up">
                <SectionTitle
                  subtitle={t('gallery.momentsSubtitle')}
                  title={t('gallery.momentsTitle')}
                />
              </RevealOnScroll>

              {/* Editorial Masonry-style Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {visibleImages.map((item, idx) => (
                  <RevealOnScroll key={item.id} variant="up" delay={idx * 60}>
                    <figure
                      className={`group relative overflow-hidden bg-theme-elevated rounded-xs border border-theme flex flex-col justify-end hover:border-[var(--color-gold)] transition-all duration-300 shadow-md hover:shadow-xl ${
                        idx === 0 ? 'sm:col-span-2 sm:aspect-16/9 aspect-4/3' : 'aspect-4/3'
                      }`}
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
                        <figcaption className="relative z-10 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-stone-100 transition-opacity duration-300">
                          <p className="text-xs font-medium tracking-wider uppercase text-stone-200">
                            {item.title}
                          </p>
                        </figcaption>
                      )}
                    </figure>
                  </RevealOnScroll>
                ))}
              </div>

              {/* Bottom CTA */}
              <RevealOnScroll variant="up" delay={150}>
                <div className="pt-12 text-center border-t border-theme">
                  <p className="text-sm text-theme-muted mb-4 font-light">
                    {t('gallery.experienceInPerson')}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link
                      to="/rooms"
                      className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest border border-theme-gold text-theme-gold hover:bg-theme-surface rounded-xs transition-colors"
                    >
                      {t('gallery.exploreRooms')}
                    </Link>
                    <Link
                      to="/booking"
                      className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest bg-theme-gold text-stone-950 rounded-xs hover:brightness-110 active:brightness-95 transition-all shadow-md"
                    >
                      {t('gallery.requestReservation')}
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
