import Container from '../components/common/Container';

export default function PromotionsPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-2">
          Exclusive Privileges
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight mb-4">
          Special Offers & Packages
        </h1>
        <p className="text-base text-stone-600 max-w-2xl leading-relaxed">
          Discover seasonal packages, weekend escapes, and curated experiences designed to make your stay unforgettable.
        </p>
      </Container>
    </div>
  );
}
