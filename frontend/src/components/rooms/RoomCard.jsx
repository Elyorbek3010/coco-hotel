import { Link } from 'react-router-dom';
import { formatUZSPrice } from '../../utils/formatters';

export default function RoomCard({ room, searchParams = '' }) {
  if (!room) return null;

  const imageUrl = room.primary_image?.image;
  const imageAlt = room.primary_image?.alt_text || room.name;

  const querySuffix = searchParams ? (searchParams.startsWith('?') ? searchParams : `?${searchParams}`) : '';
  const bookingQuery = searchParams
    ? `${searchParams.includes('?') ? searchParams : `?${searchParams}`}&room=${room.id}`
    : `?room=${room.id}`;

  return (
    <article className="group flex flex-col bg-white border border-stone-200 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Image container */}
      <div className="relative aspect-16/10 sm:aspect-4/3 w-full overflow-hidden bg-stone-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-6 text-center">
            <svg
              className="w-12 h-12 mb-2 text-stone-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1.2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            <span className="text-xs uppercase tracking-wider font-medium text-stone-400">
              Coco Hotel
            </span>
          </div>
        )}

        {/* Featured badge if present */}
        {room.is_featured && (
          <span className="absolute top-3 left-3 bg-amber-800/90 backdrop-blur-xs text-white text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-xs">
            Featured
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="flex-1 flex flex-col p-6">
        <h3 className="text-xl font-serif font-bold text-stone-900 mb-2 group-hover:text-amber-800 transition-colors break-words">
          <Link
            to={`/rooms/${room.slug}${querySuffix}`}
            className="focus-visible:outline-2 focus-visible:outline-amber-700 rounded-sm"
          >
            {room.name}
          </Link>
        </h3>

        {room.short_description && (
          <p className="text-sm text-stone-600 line-clamp-2 mb-4 leading-relaxed">
            {room.short_description}
          </p>
        )}

        {/* Room Specs */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-stone-500 mb-6 py-3 border-y border-stone-100">
          {room.max_adults != null && (
            <span className="flex items-center gap-1.5" title="Maximum Capacity">
              <svg className="w-3.5 h-3.5 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>
                {room.max_adults} {room.max_adults === 1 ? 'Adult' : 'Adults'}
                {room.max_children != null && room.max_children > 0 && ` + ${room.max_children} Ch`}
              </span>
            </span>
          )}

          {room.bed_type && (
            <span className="flex items-center gap-1.5" title="Bed Type">
              <svg className="w-3.5 h-3.5 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>{room.bed_type}</span>
            </span>
          )}

          {room.room_size && (
            <span className="flex items-center gap-1.5" title="Room Size">
              <svg className="w-3.5 h-3.5 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>{room.room_size} m²</span>
            </span>
          )}
        </div>

        {/* Pricing and Actions */}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-2">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-stone-500 block">
              Starting from
            </span>
            <span className="text-lg font-serif font-bold text-stone-900">
              {formatUZSPrice(room.price_per_night)}
            </span>
            <span className="text-xs text-stone-500 font-normal"> / night</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/rooms/${room.slug}${querySuffix}`}
              className="px-3 py-2 text-xs font-semibold text-stone-700 hover:text-amber-800 transition-colors focus-visible:outline-2 focus-visible:outline-amber-700 rounded-sm"
            >
              View Room
            </Link>
            <Link
              to={`/booking${bookingQuery}`}
              className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-700 text-white rounded-sm hover:bg-amber-800 transition-colors focus-visible:outline-2 focus-visible:outline-amber-700 rounded-sm"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
