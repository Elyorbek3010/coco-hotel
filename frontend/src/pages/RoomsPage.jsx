import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { useLanguage } from '../hooks/useLanguage';
import { getRooms } from '../api/rooms';
import Container from '../components/common/Container';
import SectionTitle from '../components/common/SectionTitle';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import RoomCard from '../components/rooms/RoomCard';
import RevealOnScroll from '../components/common/RevealOnScroll';

export default function RoomsPage() {
  const { t } = useLanguage();
  usePageMeta({
    title: t('meta.roomsTitle'),
    description: t('meta.roomsDesc'),
    canonicalPath: '/rooms',
  });

  const [searchParams] = useSearchParams();
  const searchParamsString = searchParams.toString();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchRooms = () => {
    setLoading(true);
    setError(false);
    getRooms()
      .then((data) => {
        setRooms(data || []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    getRooms()
      .then((data) => {
        if (isMounted) {
          setRooms(data || []);
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
      {/* 1. ROOMS PAGE HERO */}
      <section
        aria-label="Rooms Overview"
        className="bg-theme-secondary text-theme-main py-16 sm:py-24 border-b border-theme transition-colors duration-200"
      >
        <Container className="text-center">
          <RevealOnScroll variant="up">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-theme-gold mb-3">
              {t('rooms.subtitle')}
            </p>
            <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-theme-main tracking-tight mb-4">
              {t('rooms.title')}
            </h1>
            <p className="text-base sm:text-lg text-theme-muted font-light max-w-2xl mx-auto leading-relaxed">
              {t('rooms.desc')}
            </p>
          </RevealOnScroll>
        </Container>
      </section>

      {/* 2. ROOM LISTINGS */}
      <section aria-label="Available Rooms" className="py-16 sm:py-24 bg-theme-main transition-colors duration-200">
        <Container>
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState onRetry={fetchRooms} />
          ) : rooms.length > 0 ? (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rooms.map((room, idx) => (
                  <RevealOnScroll key={room.id} variant="up" delay={idx * 80}>
                    <RoomCard
                      room={room}
                      searchParams={searchParamsString}
                    />
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 bg-theme-surface border border-theme rounded-xs text-center max-w-xl mx-auto shadow-md">
              <h2 className="font-serif text-xl font-semibold text-theme-main mb-3">
                {t('rooms.updatingTitle')}
              </h2>
              <p className="text-sm text-theme-muted mb-6 leading-relaxed font-light">
                {t('rooms.updatingDesc')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest bg-theme-gold text-stone-950 rounded-xs hover:brightness-110 transition-colors"
                >
                  {t('rooms.contactConcierge')}
                </Link>
                <Link
                  to="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest border border-theme text-theme-main hover:bg-theme-elevated rounded-xs transition-colors"
                >
                  {t('rooms.returnHome')}
                </Link>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* 3. BOOKING CTA SECTION */}
      <section
        aria-label="Reservation Inquiry"
        className="py-16 sm:py-20 bg-theme-secondary border-t border-theme transition-colors duration-200"
      >
        <Container className="text-center">
          <RevealOnScroll variant="up">
            <SectionTitle
              subtitle={t('rooms.planYourVisit')}
              title={t('rooms.readyTitle')}
              centered
            />
            <p className="text-sm sm:text-base text-theme-muted max-w-xl mx-auto mb-8 leading-relaxed font-light">
              {t('rooms.readyDesc')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={searchParamsString ? `/booking?${searchParamsString}` : '/booking'}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-xs font-semibold uppercase tracking-widest bg-theme-gold text-stone-950 rounded-xs hover:brightness-110 transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
              >
                {t('rooms.bookStay')}
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-xs font-semibold uppercase tracking-widest border border-theme-gold text-theme-gold hover:bg-theme-surface rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
              >
                {t('rooms.inquireDirectly')}
              </Link>
            </div>
          </RevealOnScroll>
        </Container>
      </section>
    </div>
  );
}
