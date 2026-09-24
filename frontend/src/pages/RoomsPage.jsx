import Container from '../components/common/Container';

export default function RoomsPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-2">
          Accommodations
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight mb-4">
          Rooms & Suites
        </h1>
        <p className="text-base text-stone-600 max-w-2xl leading-relaxed">
          Explore our thoughtfully designed rooms and tranquil suites. Room catalog and live availability will be presented here.
        </p>
      </Container>
    </div>
  );
}
