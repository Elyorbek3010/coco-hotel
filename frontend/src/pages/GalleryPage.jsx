import Container from '../components/common/Container';

export default function GalleryPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-2">
          Visual Tour
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight mb-4">
          Photo Gallery
        </h1>
        <p className="text-base text-stone-600 max-w-2xl leading-relaxed">
          Immerse yourself in images capturing the serene architecture, luxurious rooms, landscaped courtyards, and boutique ambience of Coco Hotel.
        </p>
      </Container>
    </div>
  );
}
