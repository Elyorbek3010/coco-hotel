import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import Container from '../components/common/Container';

export default function NotFoundPage() {
  usePageMeta({
    title: '404',
    description: 'Page not found — Coco Hotel.',
    canonicalPath: '/404',
  });

  return (
    <div className="py-24 sm:py-32 bg-[#0c0a09] min-h-[60vh] flex items-center">
      <Container className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c5a880] mb-3">
          404 Error
        </p>
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-stone-100 tracking-tight mb-4">
          Page Not Found
        </h1>
        <p className="text-base sm:text-lg text-stone-400 max-w-md mx-auto mb-8 font-light leading-relaxed">
          The sanctuary page you are looking for does not exist or may have been moved.
        </p>
        <div>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 py-3.5 text-xs font-semibold uppercase tracking-wider bg-[#c5a880] text-[#0c0a09] rounded-sm hover:bg-[#dfc282] transition-colors focus-visible:outline-2 focus-visible:outline-[#c5a880] focus-visible:outline-offset-2"
          >
            Return to Home
          </Link>
        </div>
      </Container>
    </div>
  );
}
