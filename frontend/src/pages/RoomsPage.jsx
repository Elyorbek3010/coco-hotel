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
        className="bg-[#0c0a09] text-white py-16 sm:py-24 border-b border-[#c5a880]/20"
      >
        <Container className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#c5a880] mb-3">
            Accommodations
          </p>
          <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-stone-100 tracking-tight mb-4">
            Rooms &amp; Suites
          </h1>
          <p className="text-base sm:text-lg text-stone-300 font-light max-w-2xl mx-auto leading-relaxed">
            A comfortable stay designed around rest, thoughtful simplicity, and refined boutique hospitality.
          </p>
        </Container>
      </section>

      {/* 2. ROOM LISTINGS */}
      <section aria-label="Available Rooms" className="py-16 sm:py-24 bg-[#0c0a09]">
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
            <div className="p-12 bg-[#141210] border border-stone-800 rounded-xs text-center max-w-xl mx-auto">
              <h2 className="font-serif text-xl font-semibold text-stone-100 mb-3">
                Room Information Updating
              </h2>
              <p className="text-sm text-stone-400 mb-6 leading-relaxed font-light">
                Room information is currently being updated. Please contact our concierge desk directly or check back shortly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest bg-[#c5a880] text-stone-950 rounded-xs hover:bg-[#dfc282] transition-colors"
                >
                  Contact Concierge
                </Link>
                <Link
                  to="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-widest border border-stone-700 text-stone-300 hover:bg-[#181614] hover:text-white rounded-xs transition-colors"
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
        className="py-16 sm:py-20 bg-[#100e0c] border-t border-[#c5a880]/20"
      >
        <Container className="text-center">
          <SectionTitle
            subtitle="Plan Your Visit"
            title="Ready to Plan Your Stay?"
            centered
          />
          <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto mb-8 leading-relaxed font-light">
            Our reservations team is delighted to assist you with dates, room preferences, and personalized stay arrangements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={searchParamsString ? `/booking?${searchParamsString}` : '/booking'}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-xs font-semibold uppercase tracking-widest bg-[#c5a880] text-stone-950 rounded-xs hover:bg-[#dfc282] transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-[#c5a880]"
            >
              Book Your Stay
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-xs font-semibold uppercase tracking-widest border border-[#c5a880]/40 text-[#c5a880] hover:bg-[#181614] hover:text-[#dfc282] rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-[#c5a880]"
            >
              Inquire Directly
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
