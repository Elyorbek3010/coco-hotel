import { formatUZSPrice, formatDate } from '../../utils/formatters';

export default function BookingSummary({
  selectedRoom,
  checkIn,
  checkOut,
  adults,
  childrenCount,
  hotelInfo,
}) {
  const phone = hotelInfo?.phone;
  const email = hotelInfo?.email;

  return (
    <aside aria-label="Stay Summary and Booking Policy" className="space-y-6">
      {/* Selected Room & Dates Card */}
      <div className="bg-white border border-stone-200 rounded-sm p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-4">
          Stay Summary
        </h2>

        {selectedRoom ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-900">
                {selectedRoom.name}
              </h3>
              <p className="text-sm font-medium text-amber-800 mt-0.5">
                {formatUZSPrice(selectedRoom.price_per_night)}
                <span className="text-xs text-stone-500 font-normal"> / night</span>
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-stone-400 uppercase tracking-wider block">Check-In</span>
                <span className="font-semibold text-stone-800">
                  {checkIn ? formatDate(checkIn) : 'Not selected'}
                </span>
              </div>
              <div>
                <span className="text-stone-400 uppercase tracking-wider block">Check-Out</span>
                <span className="font-semibold text-stone-800">
                  {checkOut ? formatDate(checkOut) : 'Not selected'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
              <span>Guests:</span>
              <span className="font-medium text-stone-900">
                {adults} {adults === 1 ? 'Adult' : 'Adults'}
                {childrenCount > 0 && `, ${childrenCount} ${childrenCount === 1 ? 'Child' : 'Children'}`}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-stone-500 italic">
            Please choose a room from the form to view pricing and specifications.
          </p>
        )}
      </div>

      {/* Booking Policy Information */}
      <div className="bg-amber-50/60 border border-amber-200/80 rounded-sm p-6 text-stone-700">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-amber-800 mt-0.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
          <div className="space-y-2 text-xs leading-relaxed">
            <h3 className="font-semibold text-amber-950 uppercase tracking-wider text-[11px]">
              Request-Based Reservation Policy
            </h3>
            <p>
              Submitting this form sends an inquiry directly to Coco Hotel. It does not automatically charge your payment card or lock a room.
            </p>
            <p>
              Our front desk staff will review your request and contact you directly via phone or email to confirm availability and finalize your stay.
            </p>
          </div>
        </div>
      </div>

      {/* Direct Contact Option */}
      {(phone || email) && (
        <div className="bg-stone-100/70 border border-stone-200 rounded-sm p-6 text-stone-700 space-y-3 text-xs">
          <h3 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
            Prefer Immediate Assistance?
          </h3>
          <p className="text-stone-600 leading-relaxed">
            Our concierge team is at your service around the clock for direct bookings and special inquiries.
          </p>
          <div className="pt-1 space-y-1.5 font-medium">
            {phone && (
              <p>
                Telephone:{' '}
                <a href={`tel:${phone}`} className="text-amber-800 hover:text-amber-900 underline">
                  {phone}
                </a>
              </p>
            )}
            {email && (
              <p>
                Email:{' '}
                <a href={`mailto:${email}`} className="text-amber-800 hover:text-amber-900 underline">
                  {email}
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
