import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { getRooms } from '../api/rooms';
import Container from '../components/common/Container';
import SectionTitle from '../components/common/SectionTitle';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import RoomCard from '../components/rooms/RoomCard';

export default function RoomsPage() {
  usePageMeta({
    title: 'Rooms',
    description: 'Explore available room types, amenities and nightly rates at Coco Hotel.',
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
    <div className="flex flex-col">
      {/* 1. ROOMS PAGE HERO */}
      <section
        aria-label="Rooms Overview"
        className="bg-stone-900 text-white py-16 sm:py-24 border-b border-stone-800"
      >
        <Container className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-3">
            Accommodations
          </p>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight mb-4">
            Rooms &amp; Suites
          </h1>
          <p className="text-base sm:text-lg text-stone-300 font-light max-w-2xl mx-auto leading-relaxed">
            A comfortable stay designed around rest, thoughtful simplicity, and refined boutique hospitality.
          </p>
        </Container>
      </section>

      {/* 2. ROOM LISTINGS */}
      <section aria-label="Available Rooms" className="py-16 sm:py-24">
        <Container>
          {loading ? (
            <LoadingState message="Discovering accommodations..." />
          ) : error ? (
            <ErrorState
              title="Unable to load accommodations"
              message="We were unable to retrieve the room list. Please try again or reach out to our front desk."
              onRetry={fetchRooms}
            />
          ) : rooms.length > 0 ? (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    searchParams={searchParamsString}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 bg-white border border-stone-200 rounded-sm text-center max-w-xl mx-auto">
              <h2 className="font-serif text-xl font-bold text-stone-900 mb-3">
                Room Information Updating
              </h2>
              <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                Room information is currently being updated. Please contact our concierge desk directly or check back shortly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-amber-700 text-white rounded-sm hover:bg-amber-800 transition-colors"
                >
                  Contact Concierge
                </Link>
                <Link
                  to="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-wider border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-sm transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* 3. BOOKING CTA SECTION */}
      <section
        aria-label="Reservation Inquiry"
        className="py-16 sm:py-20 bg-stone-100/70 border-t border-stone-200"
      >
        <Container className="text-center">
          <SectionTitle
            subtitle="Plan Your Visit"
            title="Ready to Plan Your Stay?"
            centered
          />
          <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto mb-8 leading-relaxed">
            Our reservations team is delighted to assist you with dates, room preferences, and personalized stay arrangements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={searchParamsString ? `/booking?${searchParamsString}` : '/booking'}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-xs font-semibold uppercase tracking-widest bg-amber-700 text-white rounded-sm hover:bg-amber-800 transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-amber-700"
            >
              Book Your Stay
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-xs font-semibold uppercase tracking-widest border border-stone-300 bg-white text-stone-800 hover:bg-stone-50 rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-stone-500"
            >
              Inquire Directly
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
