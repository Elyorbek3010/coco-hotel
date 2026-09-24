import Container from '../components/common/Container';

export default function ContactPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-2">
          Get in Touch
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight mb-4">
          Contact & Concierge
        </h1>
        <p className="text-base text-stone-600 max-w-2xl leading-relaxed">
          Send our hospitality team a message, request a callback from the front desk, or view our location and directions.
        </p>
      </Container>
    </div>
  );
}
