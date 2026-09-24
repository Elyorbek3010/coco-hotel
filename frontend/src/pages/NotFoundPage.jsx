import { Link } from 'react-router-dom';
import Container from '../components/common/Container';

export default function NotFoundPage() {
  return (
    <div className="py-24 sm:py-32">
      <Container className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-700 mb-2">
          404 Error
        </p>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight mb-4">
          Page Not Found
        </h1>
        <p className="text-base sm:text-lg text-stone-600 max-w-md mx-auto mb-8">
          The sanctuary page you are looking for does not exist or may have been moved.
        </p>
        <div>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white rounded-sm hover:bg-stone-800 transition-colors focus-visible:outline-2 focus-visible:outline-stone-900 focus-visible:outline-offset-2"
          >
            Return to Home
          </Link>
        </div>
      </Container>
    </div>
  );
}
