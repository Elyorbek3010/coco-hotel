import { useSearchParams } from 'react-router-dom';
import Container from '../components/common/Container';

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const adults = searchParams.get('adults');
  const children = searchParams.get('children');
  const roomId = searchParams.get('room');

  const hasParams = checkIn || checkOut || adults || children || roomId;

  return (
    <div className="py-16 sm:py-24">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-2">
          Reservations
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight mb-4">
          Book Your Stay
        </h1>
        <p className="text-base text-stone-600 max-w-2xl leading-relaxed mb-8">
          Request a reservation with our front desk team. Choose your dates, preferred room type, and guest details to begin your stay with us.
        </p>

        {hasParams && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm max-w-xl mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-900 mb-2">
              Selected Stay Preferences
            </h2>
            <ul className="text-xs text-stone-700 space-y-1">
              {checkIn && <li><strong>Check-in:</strong> {checkIn}</li>}
              {checkOut && <li><strong>Check-out:</strong> {checkOut}</li>}
              {adults && <li><strong>Adults:</strong> {adults}</li>}
              {children && <li><strong>Children:</strong> {children}</li>}
              {roomId && <li><strong>Preferred Room ID:</strong> #{roomId}</li>}
            </ul>
          </div>
        )}
      </Container>
    </div>
  );
}
