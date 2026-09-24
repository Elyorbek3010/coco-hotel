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
      <div className="bg-[#141210] border border-[#c5a880]/30 rounded-xs p-6 shadow-2xl">
        <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-[#c5a880] mb-4">
          Stay Summary
        </h2>

        {selectedRoom ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-serif font-semibold text-stone-100">
                {selectedRoom.name}
              </h3>
              <p className="text-sm font-medium text-[#dfc282] mt-0.5">
                {formatUZSPrice(selectedRoom.price_per_night)}
                <span className="text-xs text-stone-400 font-normal"> / night</span>
              </p>
            </div>

            <div className="pt-3 border-t border-stone-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-stone-400 uppercase tracking-wider block font-medium">Check-In</span>
                <span className="font-semibold text-stone-200">
                  {checkIn ? formatDate(checkIn) : 'Not selected'}
                </span>
              </div>
              <div>
                <span className="text-stone-400 uppercase tracking-wider block font-medium">Check-Out</span>
                <span className="font-semibold text-stone-200">
                  {checkOut ? formatDate(checkOut) : 'Not selected'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span>Guests:</span>
              <span className="font-medium text-stone-200">
                {adults} {adults === 1 ? 'Adult' : 'Adults'}
                {childrenCount > 0 && `, ${childrenCount} ${childrenCount === 1 ? 'Child' : 'Children'}`}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-stone-400 italic font-light">
            Please choose a room from the form to view pricing and specifications.
          </p>
        )}
      </div>

      {/* Booking Policy Information */}
      <div className="bg-[#181614] border border-[#c5a880]/20 rounded-xs p-6 text-stone-300">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-[#c5a880] mt-0.5 shrink-0"
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
          <div className="space-y-2 text-xs leading-relaxed font-light text-stone-400">
            <h3 className="font-semibold text-[#dfc282] uppercase tracking-wider text-[11px]">
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
        <div className="bg-[#141210] border border-stone-800 rounded-xs p-6 text-stone-300 space-y-3 text-xs">
          <h3 className="font-semibold text-stone-100 uppercase tracking-wider text-[11px]">
            Prefer Immediate Assistance?
          </h3>
          <p className="text-stone-400 leading-relaxed font-light">
            Our concierge team is at your service around the clock for direct bookings and special inquiries.
          </p>
          <div className="pt-1 space-y-1.5 font-medium">
            {phone && (
              <p>
                Telephone:{' '}
                <a href={`tel:${phone}`} className="text-[#dfc282] hover:text-[#f5e8cc] underline">
                  {phone}
                </a>
              </p>
            )}
            {email && (
              <p>
                Email:{' '}
                <a href={`mailto:${email}`} className="text-[#dfc282] hover:text-[#f5e8cc] underline">
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
