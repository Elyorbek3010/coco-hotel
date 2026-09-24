import Container from '../components/common/Container';

export default function ServicesPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-2">
          Guest Experiences
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight mb-4">
          Services & Amenities
        </h1>
        <p className="text-base text-stone-600 max-w-2xl leading-relaxed">
          From tranquil spa offerings and personalized concierge to artisan breakfast and private transport services, explore everything curated for your comfort.
        </p>
      </Container>
    </div>
  );
}
