import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';

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
  const { t } = useLanguage();
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
      setValidationError(t('widget.selectCheckIn'));
      return;
    }
    if (!checkOut) {
      setValidationError(t('widget.selectCheckOut'));
      return;
    }
    if (checkIn < today) {
      setValidationError(t('widget.pastDateError'));
      return;
    }
    if (checkOut <= checkIn) {
      setValidationError(t('widget.dateOrderError'));
      return;
    }
    if (adults < 1) {
      setValidationError(t('widget.adultRequired'));
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
    <div className={`bg-theme-surface rounded-xs shadow-2xl border border-theme p-5 sm:p-7 lg:p-8 transition-colors duration-200 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Check-In */}
          <div className="flex flex-col">
            <label htmlFor="search-check-in" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-theme-gold mb-2">
              {t('booking.checkIn')}
            </label>
            <input
              type="date"
              id="search-check-in"
              min={today}
              value={checkIn}
              onChange={handleCheckInChange}
              required
              className="w-full px-3.5 py-2.5 bg-theme-input border border-theme rounded-xs text-sm text-theme-main focus:border-[var(--color-gold)] focus:outline-none transition-colors"
            />
          </div>

          {/* Check-Out */}
          <div className="flex flex-col">
            <label htmlFor="search-check-out" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-theme-gold mb-2">
              {t('booking.checkOut')}
            </label>
            <input
              type="date"
              id="search-check-out"
              min={checkIn || today}
              value={checkOut}
              onChange={handleCheckOutChange}
              required
              className="w-full px-3.5 py-2.5 bg-theme-input border border-theme rounded-xs text-sm text-theme-main focus:border-[var(--color-gold)] focus:outline-none transition-colors"
            />
          </div>

          {/* Adults */}
          <div className="flex flex-col">
            <label htmlFor="search-adults" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-theme-gold mb-2">
              {t('rooms.adults')}
            </label>
            <select
              id="search-adults"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-theme-input border border-theme rounded-xs text-sm text-theme-main focus:border-[var(--color-gold)] focus:outline-none transition-colors"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num} className="bg-theme-surface text-theme-main">
                  {num} {num === 1 ? t('booking.adult') : t('booking.adultsPlural')}
                </option>
              ))}
            </select>
          </div>

          {/* Children */}
          <div className="flex flex-col">
            <label htmlFor="search-children" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-theme-gold mb-2">
              {t('rooms.children')}
            </label>
            <select
              id="search-children"
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-theme-input border border-theme rounded-xs text-sm text-theme-main focus:border-[var(--color-gold)] focus:outline-none transition-colors"
            >
              {[0, 1, 2, 3, 4].map((num) => (
                <option key={num} value={num} className="bg-theme-surface text-theme-main">
                  {num} {num === 1 ? t('booking.child') : t('booking.childrenPlural')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Validation error message */}
        {validationError && (
          <p role="alert" className="text-xs text-rose-500 font-medium">
            {validationError}
          </p>
        )}

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-xs font-semibold uppercase tracking-widest bg-theme-gold text-stone-950 rounded-xs hover:brightness-110 active:brightness-95 transition-all shadow-sm focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] cursor-pointer"
          >
            {t('home.checkRooms')}
          </button>
        </div>
      </form>
    </div>
  );
}
