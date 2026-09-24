import { Link } from 'react-router-dom';
import { formatUZSPrice } from '../../utils/formatters';
import { useLanguage } from '../../hooks/useLanguage';

export default function RoomCard({ room, searchParams = '' }) {
  const { t } = useLanguage();
  if (!room) return null;

  const imageUrl = room.primary_image?.image;
  const imageAlt = room.primary_image?.alt_text || room.name;

  const querySuffix = searchParams ? (searchParams.startsWith('?') ? searchParams : `?${searchParams}`) : '';
  const bookingQuery = searchParams
    ? `${searchParams.includes('?') ? searchParams : `?${searchParams}`}&room=${room.id}`
    : `?room=${room.id}`;

  return (
    <article className="group flex flex-col bg-theme-surface border border-theme rounded-xs overflow-hidden shadow-md hover:shadow-2xl hover:border-[var(--color-gold)] transition-all duration-300">
      {/* Image container */}
      <div className="relative aspect-16/10 sm:aspect-4/3 w-full overflow-hidden bg-theme-elevated">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-theme-elevated text-theme-muted p-6 text-center">
            <svg
              className="w-12 h-12 mb-2 opacity-40"
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
            <span className="text-xs uppercase tracking-widest font-medium text-theme-subtle">
              Coco Hotel
            </span>
          </div>
        )}

        {/* Featured badge if present */}
        {room.is_featured && (
          <span className="absolute top-3 left-3 bg-theme-surface/90 border border-theme-gold text-theme-gold text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-xs backdrop-blur-xs">
            {t('rooms.featured')}
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="flex-1 flex flex-col p-6">
        <h3 className="text-xl font-serif font-semibold text-theme-main mb-2 group-hover:text-theme-gold transition-colors break-words">
          <Link
            to={`/rooms/${room.slug}${querySuffix}`}
            className="focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] rounded-xs"
          >
            {room.name}
          </Link>
        </h3>

        {room.short_description && (
          <p className="text-sm text-theme-muted line-clamp-2 mb-4 leading-relaxed font-light">
            {room.short_description}
          </p>
        )}

        {/* Room Specs */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-theme-muted mb-6 py-3 border-y border-theme">
          {room.max_adults != null && (
            <span className="flex items-center gap-1.5" title="Maximum Capacity">
              <svg className="w-3.5 h-3.5 text-theme-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>
                {room.max_adults} {room.max_adults === 1 ? t('booking.adult') : t('booking.adultsPlural')}
                {room.max_children != null && room.max_children > 0 && ` + ${room.max_children} ${t('booking.childrenPlural')}`}
              </span>
            </span>
          )}

          {room.bed_type && (
            <span className="flex items-center gap-1.5" title="Bed Type">
              <svg className="w-3.5 h-3.5 text-theme-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>{room.bed_type}</span>
            </span>
          )}

          {room.room_size && (
            <span className="flex items-center gap-1.5" title="Room Size">
              <svg className="w-3.5 h-3.5 text-theme-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>{room.room_size} m²</span>
            </span>
          )}
        </div>

        {/* Pricing and Actions */}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-2">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-theme-subtle block font-medium">
              {t('rooms.startingFrom')}
            </span>
            <span className="text-lg font-serif font-bold text-theme-main">
              {formatUZSPrice(room.price_per_night)}
            </span>
            <span className="text-xs text-theme-muted font-normal"> / {t('rooms.perNight')}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/rooms/${room.slug}${querySuffix}`}
              className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-theme-muted hover:text-theme-gold transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] rounded-xs"
            >
              {t('rooms.viewRoom')}
            </Link>
            <Link
              to={`/booking${bookingQuery}`}
              className="px-3.5 py-2 text-xs font-semibold uppercase tracking-widest bg-theme-gold text-stone-950 rounded-xs hover:brightness-110 active:brightness-95 transition-all shadow-sm focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
            >
              {t('rooms.bookNow')}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
