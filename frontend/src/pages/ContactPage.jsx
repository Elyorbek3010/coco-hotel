import { usePageMeta } from '../hooks/usePageMeta';
import { useHotel } from '../hooks/useHotel';
import Container from '../components/common/Container';
import ContactForm from '../components/contact/ContactForm';
import CallbackForm from '../components/contact/CallbackForm';

export default function ContactPage() {
  usePageMeta({
    title: 'Contact',
    description: 'Contact Coco Hotel, request a callback or send an inquiry.',
    canonicalPath: '/contact',
  });
  const { hotelInfo } = useHotel();

  const hotelName = hotelInfo?.name || 'Coco Hotel';
  const phone = hotelInfo?.phone;
  const secondaryPhone = hotelInfo?.secondary_phone;
  const email = hotelInfo?.email;
  const address = hotelInfo?.address;
  const mapUrl = hotelInfo?.map_url;
  const checkInTime = hotelInfo?.check_in_time;
  const checkOutTime = hotelInfo?.check_out_time;

  return (
    <div className="flex flex-col">
      {/* 1. INTRO HEADING */}
      <section
        aria-label="Contact Coco Hotel Header"
        className="bg-[#0c0a09] text-white py-16 sm:py-24 border-b border-stone-800/80"
      >
        <Container className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c5a880] mb-3">
            Concierge &amp; Inquiries
          </p>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-100 tracking-tight mb-4">
            Contact &amp; Visit Us
          </h1>
          <p className="text-base sm:text-lg text-stone-300 font-light max-w-2xl mx-auto leading-relaxed">
            Our front desk and concierge team are at your service for stay inquiries, reservations, and personalized assistance.
          </p>
        </Container>
      </section>

      {/* 2. HOTEL CONTACT INFORMATION CARDS */}
      <section aria-label="Hotel Contact Details" className="py-12 sm:py-16 bg-[#141210] border-b border-stone-800/80">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Phone */}
            <div className="p-6 bg-[#181614] border border-stone-800/80 rounded-sm flex flex-col justify-between hover:border-[#c5a880]/30 transition-colors">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#c5a880] block mb-2">
                  Telephone
                </span>
                <h2 className="text-lg font-serif font-bold text-stone-100 mb-3">
                  Direct Inquiries
                </h2>
                <div className="space-y-1 text-sm text-stone-300">
                  {phone ? (
                    <p>
                      <a href={`tel:${phone}`} className="hover:text-[#c5a880] font-medium transition-colors">
                        {phone}
                      </a>
                    </p>
                  ) : (
                    <p className="text-stone-500">Available at front desk</p>
                  )}
                  {secondaryPhone && (
                    <p className="text-xs text-stone-400">
                      Alt: <a href={`tel:${secondaryPhone}`} className="hover:text-[#c5a880] transition-colors">{secondaryPhone}</a>
                    </p>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-stone-500 mt-4 pt-3 border-t border-stone-800/60">
                Front desk support
              </p>
            </div>

            {/* Email */}
            <div className="p-6 bg-[#181614] border border-stone-800/80 rounded-sm flex flex-col justify-between hover:border-[#c5a880]/30 transition-colors">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#c5a880] block mb-2">
                  Email
                </span>
                <h2 className="text-lg font-serif font-bold text-stone-100 mb-3">
                  Electronic Correspondence
                </h2>
                <div className="text-sm text-stone-300">
                  {email ? (
                    <p className="break-all">
                      <a href={`mailto:${email}`} className="hover:text-[#c5a880] font-medium transition-colors">
                        {email}
                      </a>
                    </p>
                  ) : (
                    <p className="text-stone-500">Inquiries welcome</p>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-stone-500 mt-4 pt-3 border-t border-stone-800/60">
                Prompt email reply
              </p>
            </div>

            {/* Address */}
            <div className="p-6 bg-[#181614] border border-stone-800/80 rounded-sm flex flex-col justify-between hover:border-[#c5a880]/30 transition-colors">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#c5a880] block mb-2">
                  Location
                </span>
                <h2 className="text-lg font-serif font-bold text-stone-100 mb-3">
                  Physical Address
                </h2>
                <div className="text-sm text-stone-300 leading-relaxed">
                  {address ? (
                    <p>{address}</p>
                  ) : (
                    <p className="text-stone-500">{hotelName}</p>
                  )}
                </div>
              </div>
              {mapUrl && (
                <div className="mt-4 pt-3 border-t border-stone-800/60">
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#c5a880] hover:text-[#dfc282] inline-flex items-center gap-1 transition-colors"
                  >
                    Open in Maps &rarr;
                  </a>
                </div>
              )}
            </div>

            {/* Check-In / Check-Out */}
            <div className="p-6 bg-[#181614] border border-stone-800/80 rounded-sm flex flex-col justify-between hover:border-[#c5a880]/30 transition-colors">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#c5a880] block mb-2">
                  Hours &amp; Timing
                </span>
                <h2 className="text-lg font-serif font-bold text-stone-100 mb-3">
                  Stay Schedule
                </h2>
                <div className="space-y-2 text-sm text-stone-300">
                  <div>
                    <span className="text-xs text-stone-400 block uppercase tracking-wider">Check-In</span>
                    <span className="font-medium text-stone-100">
                      {checkInTime || 'From 14:00'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-stone-400 block uppercase tracking-wider">Check-Out</span>
                    <span className="font-medium text-stone-100">
                      {checkOutTime || 'Until 12:00'}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-stone-500 mt-4 pt-3 border-t border-stone-800/60">
                Reception open 24/7
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 3 & 4. GUEST FORMS (CONTACT MESSAGE & CALLBACK REQUEST) */}
      <section aria-label="Guest Inquiries and Callback Requests" className="py-16 sm:py-24 bg-[#0c0a09]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c5a880] mb-2">
              Get in Touch
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100 tracking-tight mb-4">
              How May We Help You?
            </h2>
            <p className="text-sm text-stone-400 leading-relaxed">
              Send our team a direct inquiry or request a telephone callback at a time convenient for you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Contact Message Form */}
            <div>
              <ContactForm />
            </div>

            {/* Callback Request Form */}
            <div>
              <CallbackForm />
            </div>
          </div>
        </Container>
      </section>

      {/* 5. LOCATION / DIRECTIONS AREA */}
      {(address || mapUrl) && (
        <section
          aria-label="Location and Directions"
          className="py-16 sm:py-20 bg-[#080706] text-white border-t border-stone-800/80"
        >
          <Container>
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c5a880] block">
                Finding {hotelName}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
                Directions &amp; Arrival
              </h2>
              {address && (
                <p className="text-stone-300 text-base leading-relaxed">
                  {address}
                </p>
              )}
              <p className="text-sm text-stone-400 leading-relaxed max-w-xl mx-auto">
                Conveniently located with effortless access to local cultural landmarks, business centers, and transportation hubs. If you need navigation assistance upon arrival, our front desk is on call 24 hours a day.
              </p>
              {mapUrl && (
                <div className="pt-2">
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-[#c5a880] text-[#0c0a09] rounded-sm hover:bg-[#dfc282] transition-colors focus-visible:outline-2 focus-visible:outline-[#c5a880]"
                  >
                    View Interactive Map &amp; Directions &rarr;
                  </a>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
