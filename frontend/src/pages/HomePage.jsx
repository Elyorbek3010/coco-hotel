import { Link } from 'react-router-dom';
import Container from '../components/common/Container';

export default function HomePage() {
  return (
    <div className="py-24 sm:py-32 bg-stone-100/60 border-b border-stone-200">
      <Container className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-3">
          Welcome to Coco Hotel
        </p>
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-stone-900 tracking-tight mb-4">
          COCO HOTEL
        </h1>
        <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto mb-8 font-light">
          Your Quiet Corner of the City
        </p>
        <div>
          <Link
            to="/booking"
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold uppercase tracking-wider bg-amber-700 text-white rounded-sm hover:bg-amber-800 transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-amber-700 focus-visible:outline-offset-2"
          >
            Book Your Stay
          </Link>
        </div>
      </Container>
    </div>
  );
}
