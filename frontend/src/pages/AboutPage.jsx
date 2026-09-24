import Container from '../components/common/Container';

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-2">
          Our Heritage & Philosophy
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight mb-4">
          About Coco Hotel
        </h1>
        <p className="text-base text-stone-600 max-w-2xl leading-relaxed">
          Discover the history, peaceful architectural sanctuary, and boutique philosophy that define our hospitality experience.
        </p>
      </Container>
    </div>
  );
}
