import { useParams, Link } from 'react-router-dom';
import Container from '../components/common/Container';

export default function RoomDetailPage() {
  const { slug } = useParams();

  return (
    <div className="py-16 sm:py-24">
      <Container>
        <div className="mb-6">
          <Link
            to="/rooms"
            className="text-xs font-semibold uppercase tracking-widest text-amber-700 hover:text-amber-800 transition-colors focus-visible:outline-2 focus-visible:outline-amber-700 rounded-sm"
          >
            &larr; Back to all rooms
          </Link>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">
          Room Details
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight mb-4">
          {slug ? `Room: ${slug}` : 'Room Detail'}
        </h1>
        <p className="text-base text-stone-600 max-w-2xl leading-relaxed mb-6">
          Detailed room amenities, specifications, image gallery, and direct booking options will be displayed here.
        </p>
      </Container>
    </div>
  );
}
