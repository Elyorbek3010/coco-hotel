import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getTomorrowString() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function BookingSearchWidget({ className = '' }) {
  const navigate = useNavigate();
  const today = getTodayString();
  const tomorrow = getTomorrowString();

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [validationError, setValidationError] = useState('');

  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;
    setCheckIn(newCheckIn);
    setValidationError('');
    // Auto-advance check-out if check-out <= newCheckIn
    if (checkOut <= newCheckIn) {
      const nextDay = new Date(newCheckIn);
      nextDay.setDate(nextDay.getDate() + 1);
      const y = nextDay.getFullYear();
      const m = String(nextDay.getMonth() + 1).padStart(2, '0');
      const d = String(nextDay.getDate()).padStart(2, '0');
      setCheckOut(`${y}-${m}-${d}`);
    }
  };

  const handleCheckOutChange = (e) => {
    setCheckOut(e.target.value);
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!checkIn) {
      setValidationError('Please select a check-in date.');
      return;
    }
    if (!checkOut) {
      setValidationError('Please select a check-out date.');
      return;
    }
    if (checkIn < today) {
      setValidationError('Check-in date cannot be in the past.');
      return;
    }
    if (checkOut <= checkIn) {
      setValidationError('Check-out date must be after check-in date.');
      return;
    }
    if (adults < 1) {
      setValidationError('At least 1 adult guest is required.');
      return;
    }
    if (children < 0) {
      setValidationError('Children count cannot be negative.');
      return;
    }

    const searchParams = new URLSearchParams({
      checkIn,
      checkOut,
      adults: String(adults),
      children: String(children),
    });

    navigate(`/booking?${searchParams.toString()}`);
  };

  return (
    <div className={`bg-white rounded-sm shadow-xl border border-stone-200 p-4 sm:p-6 lg:p-8 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Check-In */}
          <div className="flex flex-col">
            <label htmlFor="search-check-in" className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Check-In
            </label>
            <input
              type="date"
              id="search-check-in"
              min={today}
              value={checkIn}
              onChange={handleCheckInChange}
              required
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-sm text-sm text-stone-900 focus:bg-white focus:border-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-700"
            />
          </div>

          {/* Check-Out */}
          <div className="flex flex-col">
            <label htmlFor="search-check-out" className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Check-Out
            </label>
            <input
              type="date"
              id="search-check-out"
              min={checkIn || today}
              value={checkOut}
              onChange={handleCheckOutChange}
              required
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-sm text-sm text-stone-900 focus:bg-white focus:border-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-700"
            />
          </div>

          {/* Adults */}
          <div className="flex flex-col">
            <label htmlFor="search-adults" className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Adults
            </label>
            <select
              id="search-adults"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-sm text-sm text-stone-900 focus:bg-white focus:border-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-700"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Adult' : 'Adults'}
                </option>
              ))}
            </select>
          </div>

          {/* Children & Submit CTA */}
          <div className="flex flex-col sm:col-span-2 lg:col-span-1">
            <label htmlFor="search-children" className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Children
            </label>
            <select
              id="search-children"
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-sm text-sm text-stone-900 focus:bg-white focus:border-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-700"
            >
              {[0, 1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Child' : 'Children'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Validation error message */}
        {validationError && (
          <p role="alert" className="text-xs text-rose-700 font-medium">
            {validationError}
          </p>
        )}

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-xs font-semibold uppercase tracking-widest bg-amber-700 text-white rounded-sm hover:bg-amber-800 transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-amber-700 focus-visible:outline-offset-2"
          >
            Check Rooms &amp; Rates
          </button>
        </div>
      </form>
    </div>
  );
}
