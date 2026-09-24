import Container from '../components/common/Container';

export default function BookingPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-2">
          Reservations
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight mb-4">
          Book Your Stay
        </h1>
        <p className="text-base text-stone-600 max-w-2xl leading-relaxed">
          Request a reservation with our front desk team. Choose your dates, preferred room type, and guest details to begin your stay with us.
        </p>
      </Container>
    </div>
  );
}
