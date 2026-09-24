import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { useHotel } from '../hooks/useHotel';
import { getRooms } from '../api/rooms';
import { createBookingRequest } from '../api/bookings';
import { formatUZSPrice, formatDate } from '../utils/formatters';
import Container from '../components/common/Container';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import BookingSummary from '../components/booking/BookingSummary';

function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getTomorrowString(baseDate) {
  const date = baseDate ? new Date(baseDate) : new Date();
  date.setDate(date.getDate() + 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function BookingPage() {
  usePageMeta({
    title: 'Book Your Stay',
    description:
      'Send a booking request to Coco Hotel and let hotel staff confirm your stay.',
    canonicalPath: '/booking',
  });
  const { hotelInfo } = useHotel();
  const [searchParams] = useSearchParams();

  const today = getTodayString();

  // Rooms list state
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [roomsError, setRoomsError] = useState(false);

  // Form field state initialized from search parameters
  const [roomId, setRoomId] = useState(searchParams.get('room') || '');
  const [checkIn, setCheckIn] = useState(() => {
    const paramIn = searchParams.get('checkIn');
    return paramIn && paramIn >= today ? paramIn : today;
  });
  const [checkOut, setCheckOut] = useState(() => {
    const paramIn = searchParams.get('checkIn');
    const paramOut = searchParams.get('checkOut');
    const minIn = paramIn && paramIn >= today ? paramIn : today;
    return paramOut && paramOut > minIn ? paramOut : getTomorrowString(minIn);
  });
  const [adults, setAdults] = useState(() => {
    const paramAdults = parseInt(searchParams.get('adults'), 10);
    return !isNaN(paramAdults) && paramAdults >= 1 ? paramAdults : 1;
  });
  const [childrenCount, setChildrenCount] = useState(() => {
    const paramChildren = parseInt(searchParams.get('children'), 10);
    return !isNaN(paramChildren) && paramChildren >= 0 ? paramChildren : 0;
  });
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  // Error feedback state
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const fetchRooms = () => {
    setLoadingRooms(true);
    setRoomsError(false);
    getRooms()
      .then((data) => {
        const roomList = data || [];
        setRooms(roomList);
        setLoadingRooms(false);

        // Preselect room from searchParams if valid, else pick first if available
        const queryRoomId = searchParams.get('room');
        if (queryRoomId && roomList.some((r) => String(r.id) === queryRoomId)) {
          setRoomId(queryRoomId);
        } else if (roomList.length > 0) {
          setRoomId((prevId) => prevId || String(roomList[0].id));
        }
      })
      .catch(() => {
        setRoomsError(true);
        setLoadingRooms(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    getRooms()
      .then((data) => {
        if (!isMounted) return;
        const roomList = data || [];
        setRooms(roomList);
        setLoadingRooms(false);

        const queryRoomId = searchParams.get('room');
        if (queryRoomId && roomList.some((r) => String(r.id) === queryRoomId)) {
          setRoomId(queryRoomId);
        } else if (roomList.length > 0) {
          setRoomId((prevId) => prevId || String(roomList[0].id));
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setRoomsError(true);
        setLoadingRooms(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  // Selected room object
  const selectedRoom = rooms.find((r) => String(r.id) === String(roomId)) || null;

  // Handle room change with capacity guard
  const handleRoomChange = (e) => {
    const newId = e.target.value;
    setRoomId(newId);
    setFieldErrors((prev) => ({ ...prev, room: '' }));

    const r = rooms.find((item) => String(item.id) === newId);
    if (r) {
      if (adults > r.max_adults) {
        setAdults(r.max_adults);
      }
      if (childrenCount > r.max_children) {
        setChildrenCount(r.max_children);
      }
    }
  };

  // Handle check-in change
  const handleCheckInChange = (e) => {
    const newIn = e.target.value;
    setCheckIn(newIn);
    setFieldErrors((prev) => ({ ...prev, check_in: '', check_out: '' }));

    if (checkOut <= newIn) {
      setCheckOut(getTomorrowString(newIn));
    }
  };

  // Handle check-out change
  const handleCheckOutChange = (e) => {
    setCheckOut(e.target.value);
    setFieldErrors((prev) => ({ ...prev, check_out: '' }));
  };

  // Client validation
  const validateForm = () => {
    const errors = {};

    if (!roomId) {
      errors.room = 'Please select a room for your stay.';
    }

    if (!checkIn) {
      errors.check_in = 'Please specify a check-in date.';
    } else if (checkIn < today) {
      errors.check_in = 'Check-in date cannot be in the past.';
    }

    if (!checkOut) {
      errors.check_out = 'Please specify a check-out date.';
    } else if (checkOut <= checkIn) {
      errors.check_out = 'Check-out date must be strictly after check-in date.';
    }

    if (adults < 1) {
      errors.adults = 'At least 1 adult guest is required.';
    } else if (selectedRoom && adults > selectedRoom.max_adults) {
      errors.adults = `Selected room accommodates at most ${selectedRoom.max_adults} adults.`;
    }

    if (childrenCount < 0) {
      errors.children = 'Number of children cannot be negative.';
    } else if (selectedRoom && childrenCount > selectedRoom.max_children) {
      errors.children = `Selected room accommodates at most ${selectedRoom.max_children} children.`;
    }

    if (!fullName.trim()) {
      errors.full_name = 'Please provide your full name.';
    }

    if (!phone.trim()) {
      errors.phone = 'Please provide a contact phone number.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = 'Please provide your email address.';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    const payload = {
      room: Number(roomId),
      check_in: checkIn,
      check_out: checkOut,
      adults: Number(adults),
      children: Number(childrenCount),
      full_name: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      special_request: specialRequest.trim(),
    };

    try {
      const response = await createBookingRequest(payload);
      setSubmissionResult(response.data);
      setIsDuplicate(response.status === 200);
      setSubmitSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;

        if (status === 400 && data && typeof data === 'object') {
          const parsedFieldErrors = {};
          let generalMsg = '';

          Object.keys(data).forEach((key) => {
            const val = data[key];
            const msg = Array.isArray(val) ? val.join(' ') : String(val);

            if (key === 'non_field_errors') {
              generalMsg = msg;
            } else if (key === 'detail') {
              generalMsg = msg;
            } else {
              parsedFieldErrors[key] = msg;
            }
          });

          setFieldErrors(parsedFieldErrors);
          if (generalMsg) {
            setGeneralError(generalMsg);
          }
        } else if (status === 429) {
          setGeneralError(
            'You have submitted multiple requests recently. Please wait a moment before trying again, or call our concierge desk directly.'
          );
        } else {
          setGeneralError(
            'We were unable to process your request at this time. Please try again or reach out to our front desk.'
          );
        }
      } else {
        setGeneralError(
          'Network connection error. Please verify your connection or contact the hotel directly.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form to submit another request
  const handleReset = () => {
    setSubmitSuccess(false);
    setIsDuplicate(false);
    setSubmissionResult(null);
    setFieldErrors({});
    setGeneralError('');
    setFullName('');
    setPhone('');
    setEmail('');
    setSpecialRequest('');
  };

  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-[#0c0a09]">
      <Container>
        {/* HERO TITLE */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#c5a880] mb-2">
            Reservations Desk
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-stone-100 tracking-tight mb-4">
            Book Your Stay
          </h1>
          <p className="text-base text-stone-300 leading-relaxed font-light">
            Submit your stay preferences below. Our front desk team will review your inquiry and contact you directly to confirm availability and finalize arrangements.
          </p>
        </div>

        {/* LOADING ROOMS */}
        {loadingRooms ? (
          <div className="py-16">
            <LoadingState message="Preparing room options and availability..." />
          </div>
        ) : roomsError ? (
          <div className="max-w-xl mx-auto py-12">
            <ErrorState
              title="Unable to load room catalogue"
              message="We were unable to fetch the available room types. Please try refreshing or reach out to our front desk."
              onRetry={fetchRooms}
            />
          </div>
        ) : rooms.length === 0 ? (
          <div className="max-w-xl mx-auto py-12 p-8 bg-[#141210] border border-stone-800 rounded-xs text-center">
            <h2 className="font-serif text-xl font-semibold text-stone-100 mb-2">
              Rooms Being Updated
            </h2>
            <p className="text-sm text-stone-400 mb-6 leading-relaxed font-light">
              Our accommodations catalogue is currently being refreshed. Please contact our front desk directly for live reservation assistance.
            </p>
            {hotelInfo?.phone && (
              <a
                href={`tel:${hotelInfo.phone}`}
                className="inline-flex items-center px-6 py-3 text-xs font-semibold uppercase tracking-widest bg-[#c5a880] text-stone-950 rounded-xs hover:bg-[#dfc282] transition-colors"
              >
                Call Front Desk ({hotelInfo.phone})
              </a>
            )}
          </div>
        ) : submitSuccess && submissionResult ? (
          /* SUCCESS VIEW */
          <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
            {/* Header Status Card */}
            <div className="p-8 sm:p-10 bg-[#141210] border border-[#c5a880]/30 rounded-xs shadow-2xl text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#1f1b17] text-[#c5a880] flex items-center justify-center border border-[#c5a880]/30">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#c5a880]">
                {isDuplicate ? 'Request Already In Progress' : 'Inquiry Successfully Submitted'}
              </p>

              <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-100">
                {isDuplicate
                  ? 'Your Request Has Already Been Received'
                  : 'Your Booking Request Has Been Received'}
              </h2>

              <p className="text-sm text-stone-300 max-w-lg mx-auto leading-relaxed font-light">
                {isDuplicate
                  ? 'We have already logged a booking inquiry with these details. Our hotel staff is actively reviewing it and will reach out shortly.'
                  : 'Thank you for choosing Coco Hotel. Our reservations team will contact you via phone or email to confirm availability, rates, and complete your reservation.'}
              </p>

              <div className="inline-block px-3.5 py-1 bg-[#181614] border border-[#c5a880]/20 text-xs font-mono text-[#dfc282] rounded-xs">
                Reference ID: #{submissionResult.id} &bull; Status: Request Received
              </div>
            </div>

            {/* Request Summary Details Card */}
            <div className="bg-[#141210] border border-stone-800 rounded-xs p-8 shadow-xl space-y-6">
              <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-[#c5a880] pb-2 border-b border-stone-800">
                Submitted Stay Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone-400 block mb-0.5 font-medium">
                    Accommodation
                  </span>
                  <span className="font-semibold text-stone-200">
                    {submissionResult.room_name_snapshot || selectedRoom?.name || 'Hotel Room'}
                  </span>
                  {submissionResult.price_per_night_snapshot && (
                    <span className="text-xs text-stone-400 block">
                      {formatUZSPrice(submissionResult.price_per_night_snapshot)} / night
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-xs uppercase tracking-wider text-stone-400 block mb-0.5 font-medium">
                    Guests
                  </span>
                  <span className="font-medium text-stone-200">
                    {submissionResult.adults} {submissionResult.adults === 1 ? 'Adult' : 'Adults'}
                    {submissionResult.children > 0 &&
                      `, ${submissionResult.children} ${submissionResult.children === 1 ? 'Child' : 'Children'}`}
                  </span>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-wider text-stone-400 block mb-0.5 font-medium">
                    Check-In
                  </span>
                  <span className="font-medium text-stone-200">
                    {formatDate(submissionResult.check_in)}
                  </span>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-wider text-stone-400 block mb-0.5 font-medium">
                    Check-Out
                  </span>
                  <span className="font-medium text-stone-200">
                    {formatDate(submissionResult.check_out)}
                  </span>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-wider text-stone-400 block mb-0.5 font-medium">
                    Contact Name
                  </span>
                  <span className="font-medium text-stone-200">
                    {submissionResult.full_name}
                  </span>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-wider text-stone-400 block mb-0.5 font-medium">
                    Telephone &amp; Email
                  </span>
                  <span className="font-medium text-stone-200 block">
                    {submissionResult.phone}
                  </span>
                  <span className="text-xs text-stone-400 block">
                    {submissionResult.email}
                  </span>
                </div>
              </div>

              {submissionResult.special_request && (
                <div className="pt-4 border-t border-stone-800">
                  <span className="text-xs uppercase tracking-wider text-stone-400 block mb-1 font-medium">
                    Special Requests Note
                  </span>
                  <p className="text-sm text-stone-300 bg-[#181614] p-4 border border-stone-800 rounded-xs font-light">
                    {submissionResult.special_request}
                  </p>
                </div>
              )}
            </div>

            {/* Crucial Hotel Confirmation Notice */}
            <div className="p-6 bg-[#181614] border border-[#c5a880]/30 rounded-xs text-xs text-stone-300 leading-relaxed font-light">
              <strong className="text-[#dfc282] font-semibold block mb-1">
                Notice Regarding Manual Confirmation:
              </strong>
              Submitting this inquiry does not guarantee an immediate room booking or process payment. Your reservation is formally confirmed only once our staff contacts you and confirms room availability.
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3 text-xs font-semibold uppercase tracking-widest border border-[#c5a880]/40 text-[#c5a880] hover:bg-[#181614] hover:text-[#dfc282] rounded-xs transition-colors"
              >
                Submit Another Request
              </button>
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-xs font-semibold uppercase tracking-widest bg-[#c5a880] text-stone-950 rounded-xs hover:bg-[#dfc282] transition-colors"
              >
                Return to Homepage &rarr;
              </Link>
            </div>
          </div>
        ) : (
          /* MAIN FORM VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Form Column (7 cols) */}
            <div className="lg:col-span-7 bg-[#141210] border border-[#c5a880]/30 rounded-xs p-6 sm:p-8 lg:p-10 shadow-2xl">
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Form-level error alert */}
                {generalError && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="p-4 bg-rose-950/40 border border-rose-800/60 text-rose-300 rounded-xs text-xs leading-relaxed"
                  >
                    {generalError}
                  </div>
                )}

                {/* 1. ROOM SELECTION */}
                <div>
                  <label
                    htmlFor="booking-room"
                    className="block text-[11px] font-medium uppercase tracking-[0.15em] text-[#c5a880] mb-2"
                  >
                    Room Preference <span className="text-[#dfc282]">*</span>
                  </label>
                  <select
                    id="booking-room"
                    value={roomId}
                    onChange={handleRoomChange}
                    aria-describedby={fieldErrors.room ? 'booking-room-error' : undefined}
                    className={`w-full px-3.5 py-2.5 bg-[#1a1714] border rounded-xs text-sm text-stone-100 focus:bg-[#1f1b17] focus:outline-none focus:ring-1 ${
                      fieldErrors.room
                        ? 'border-rose-500/80 focus:border-rose-400 focus:ring-rose-400'
                        : 'border-[#c5a880]/30 focus:border-[#c5a880] focus:ring-[#c5a880]'
                    }`}
                  >
                    <option value="" className="bg-[#141210] text-stone-400">-- Choose a room type --</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id} className="bg-[#141210] text-stone-100">
                        {r.name} — {formatUZSPrice(r.price_per_night)} / night
                      </option>
                    ))}
                  </select>
                  {fieldErrors.room && (
                    <p id="booking-room-error" role="alert" className="mt-1 text-xs text-rose-400 font-medium">
                      {fieldErrors.room}
                    </p>
                  )}
                </div>

                {/* 2. DATES (Check-in & Check-out) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="booking-check-in"
                      className="block text-[11px] font-medium uppercase tracking-[0.15em] text-[#c5a880] mb-2"
                    >
                      Check-In Date <span className="text-[#dfc282]">*</span>
                    </label>
                    <input
                      type="date"
                      id="booking-check-in"
                      min={today}
                      value={checkIn}
                      onChange={handleCheckInChange}
                      aria-describedby={fieldErrors.check_in ? 'booking-checkin-error' : undefined}
                      className={`w-full px-3.5 py-2.5 bg-[#1a1714] border rounded-xs text-sm text-stone-100 focus:bg-[#1f1b17] focus:outline-none focus:ring-1 ${
                        fieldErrors.check_in
                          ? 'border-rose-500/80 focus:border-rose-400 focus:ring-rose-400'
                          : 'border-[#c5a880]/30 focus:border-[#c5a880] focus:ring-[#c5a880]'
                      }`}
                    />
                    {fieldErrors.check_in && (
                      <p id="booking-checkin-error" role="alert" className="mt-1 text-xs text-rose-400 font-medium">
                        {fieldErrors.check_in}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="booking-check-out"
                      className="block text-[11px] font-medium uppercase tracking-[0.15em] text-[#c5a880] mb-2"
                    >
                      Check-Out Date <span className="text-[#dfc282]">*</span>
                    </label>
                    <input
                      type="date"
                      id="booking-check-out"
                      min={checkIn ? getTomorrowString(checkIn) : today}
                      value={checkOut}
                      onChange={handleCheckOutChange}
                      aria-describedby={fieldErrors.check_out ? 'booking-checkout-error' : undefined}
                      className={`w-full px-3.5 py-2.5 bg-[#1a1714] border rounded-xs text-sm text-stone-100 focus:bg-[#1f1b17] focus:outline-none focus:ring-1 ${
                        fieldErrors.check_out
                          ? 'border-rose-500/80 focus:border-rose-400 focus:ring-rose-400'
                          : 'border-[#c5a880]/30 focus:border-[#c5a880] focus:ring-[#c5a880]'
                      }`}
                    />
                    {fieldErrors.check_out && (
                      <p id="booking-checkout-error" role="alert" className="mt-1 text-xs text-rose-400 font-medium">
                        {fieldErrors.check_out}
                      </p>
                    )}
                  </div>
                </div>

                {/* 3. GUEST COUNTS (Adults & Children) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="booking-adults"
                      className="block text-[11px] font-medium uppercase tracking-[0.15em] text-[#c5a880] mb-2"
                    >
                      Adults (Age 12+) <span className="text-[#dfc282]">*</span>
                    </label>
                    <input
                      type="number"
                      id="booking-adults"
                      min="1"
                      max={selectedRoom?.max_adults || 10}
                      value={adults}
                      onChange={(e) => {
                        setAdults(parseInt(e.target.value, 10) || 1);
                        setFieldErrors((prev) => ({ ...prev, adults: '' }));
                      }}
                      aria-describedby={fieldErrors.adults ? 'booking-adults-error' : undefined}
                      className={`w-full px-3.5 py-2.5 bg-[#1a1714] border rounded-xs text-sm text-stone-100 focus:bg-[#1f1b17] focus:outline-none focus:ring-1 ${
                        fieldErrors.adults
                          ? 'border-rose-500/80 focus:border-rose-400 focus:ring-rose-400'
                          : 'border-[#c5a880]/30 focus:border-[#c5a880] focus:ring-[#c5a880]'
                      }`}
                    />
                    {fieldErrors.adults && (
                      <p id="booking-adults-error" role="alert" className="mt-1 text-xs text-rose-400 font-medium">
                        {fieldErrors.adults}
                      </p>
                    )}
                    {selectedRoom && (
                      <span className="text-[11px] text-stone-400 mt-0.5 block font-light">
                        Max: {selectedRoom.max_adults} adults for this room
                      </span>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="booking-children"
                      className="block text-[11px] font-medium uppercase tracking-[0.15em] text-[#c5a880] mb-2"
                    >
                      Children
                    </label>
                    <input
                      type="number"
                      id="booking-children"
                      min="0"
                      max={selectedRoom?.max_children || 10}
                      value={childrenCount}
                      onChange={(e) => {
                        setChildrenCount(parseInt(e.target.value, 10) || 0);
                        setFieldErrors((prev) => ({ ...prev, children: '' }));
                      }}
                      aria-describedby={fieldErrors.children ? 'booking-children-error' : undefined}
                      className={`w-full px-3.5 py-2.5 bg-[#1a1714] border rounded-xs text-sm text-stone-100 focus:bg-[#1f1b17] focus:outline-none focus:ring-1 ${
                        fieldErrors.children
                          ? 'border-rose-500/80 focus:border-rose-400 focus:ring-rose-400'
                          : 'border-[#c5a880]/30 focus:border-[#c5a880] focus:ring-[#c5a880]'
                      }`}
                    />
                    {fieldErrors.children && (
                      <p id="booking-children-error" role="alert" className="mt-1 text-xs text-rose-400 font-medium">
                        {fieldErrors.children}
                      </p>
                    )}
                    {selectedRoom && (
                      <span className="text-[11px] text-stone-400 mt-0.5 block font-light">
                        Max: {selectedRoom.max_children} children for this room
                      </span>
                    )}
                  </div>
                </div>

                {/* 4. GUEST CONTACT DETAILS */}
                <div className="pt-4 border-t border-stone-800 space-y-4">
                  <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-[#c5a880]">
                    Guest Contact Information
                  </h3>

                  <div>
                    <label
                      htmlFor="booking-fullname"
                      className="block text-[11px] font-medium uppercase tracking-[0.15em] text-[#c5a880] mb-2"
                    >
                      Full Name <span className="text-[#dfc282]">*</span>
                    </label>
                    <input
                      type="text"
                      id="booking-fullname"
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setFieldErrors((prev) => ({ ...prev, full_name: '' }));
                      }}
                      placeholder="e.g. Elena Rostova"
                      aria-describedby={fieldErrors.full_name ? 'booking-fullname-error' : undefined}
                      className={`w-full px-3.5 py-2.5 bg-[#1a1714] border rounded-xs text-sm text-stone-100 placeholder-stone-500 focus:bg-[#1f1b17] focus:outline-none focus:ring-1 ${
                        fieldErrors.full_name
                          ? 'border-rose-500/80 focus:border-rose-400 focus:ring-rose-400'
                          : 'border-[#c5a880]/30 focus:border-[#c5a880] focus:ring-[#c5a880]'
                      }`}
                    />
                    {fieldErrors.full_name && (
                      <p id="booking-fullname-error" role="alert" className="mt-1 text-xs text-rose-400 font-medium">
                        {fieldErrors.full_name}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="booking-phone"
                        className="block text-[11px] font-medium uppercase tracking-[0.15em] text-[#c5a880] mb-2"
                      >
                        Phone Number <span className="text-[#dfc282]">*</span>
                      </label>
                      <input
                        type="tel"
                        id="booking-phone"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setFieldErrors((prev) => ({ ...prev, phone: '' }));
                        }}
                        placeholder="+998 90 123 4567"
                        aria-describedby={fieldErrors.phone ? 'booking-phone-error' : undefined}
                        className={`w-full px-3.5 py-2.5 bg-[#1a1714] border rounded-xs text-sm text-stone-100 placeholder-stone-500 focus:bg-[#1f1b17] focus:outline-none focus:ring-1 ${
                          fieldErrors.phone
                            ? 'border-rose-500/80 focus:border-rose-400 focus:ring-rose-400'
                            : 'border-[#c5a880]/30 focus:border-[#c5a880] focus:ring-[#c5a880]'
                        }`}
                      />
                      {fieldErrors.phone && (
                        <p id="booking-phone-error" role="alert" className="mt-1 text-xs text-rose-400 font-medium">
                          {fieldErrors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="booking-email"
                        className="block text-[11px] font-medium uppercase tracking-[0.15em] text-[#c5a880] mb-2"
                      >
                        Email Address <span className="text-[#dfc282]">*</span>
                      </label>
                      <input
                        type="email"
                        id="booking-email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setFieldErrors((prev) => ({ ...prev, email: '' }));
                        }}
                        placeholder="elena@example.com"
                        aria-describedby={fieldErrors.email ? 'booking-email-error' : undefined}
                        className={`w-full px-3.5 py-2.5 bg-[#1a1714] border rounded-xs text-sm text-stone-100 placeholder-stone-500 focus:bg-[#1f1b17] focus:outline-none focus:ring-1 ${
                          fieldErrors.email
                            ? 'border-rose-500/80 focus:border-rose-400 focus:ring-rose-400'
                            : 'border-[#c5a880]/30 focus:border-[#c5a880] focus:ring-[#c5a880]'
                        }`}
                      />
                      {fieldErrors.email && (
                        <p id="booking-email-error" role="alert" className="mt-1 text-xs text-rose-400 font-medium">
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 5. SPECIAL REQUEST (Optional) */}
                <div className="pt-2">
                  <label
                    htmlFor="booking-special-request"
                    className="block text-[11px] font-medium uppercase tracking-[0.15em] text-[#c5a880] mb-2"
                  >
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="booking-special-request"
                    rows="3"
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    placeholder="Arriving late, preferred quiet room, dietary requests..."
                    className="w-full px-3.5 py-2.5 bg-[#1a1714] border border-[#c5a880]/30 rounded-xs text-sm text-stone-100 placeholder-stone-500 focus:bg-[#1f1b17] focus:border-[#c5a880] focus:outline-none focus:ring-1 focus:ring-[#c5a880]"
                  />
                  <span className="text-[11px] text-stone-400 mt-1 block font-light">
                    Special requests are subject to availability upon check-in.
                  </span>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center px-8 py-4 text-xs font-semibold uppercase tracking-widest bg-[#c5a880] text-stone-950 rounded-xs hover:bg-[#dfc282] transition-colors shadow-lg focus-visible:outline-2 focus-visible:outline-[#c5a880] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-stone-950/30 border-t-stone-950 rounded-full animate-spin" />
                        Submitting Request...
                      </span>
                    ) : (
                      'Submit Booking Request'
                    )}
                  </button>
                  <p className="text-[11px] text-stone-400 text-center mt-2.5 font-light">
                    No charge is made at this stage. Hotel staff will contact you to confirm.
                  </p>
                </div>
              </form>
            </div>

            {/* Sidebar Summary Column (5 cols) */}
            <div className="lg:col-span-5">
              <BookingSummary
                selectedRoom={selectedRoom}
                checkIn={checkIn}
                checkOut={checkOut}
                adults={adults}
                childrenCount={childrenCount}
                hotelInfo={hotelInfo}
              />
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
