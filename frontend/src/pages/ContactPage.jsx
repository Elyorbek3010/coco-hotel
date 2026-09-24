import { usePageMeta } from '../hooks/usePageMeta';
import { useHotel } from '../hooks/useHotel';
import { useLanguage } from '../hooks/useLanguage';
import Container from '../components/common/Container';
import ContactForm from '../components/contact/ContactForm';
import CallbackForm from '../components/contact/CallbackForm';
import RevealOnScroll from '../components/common/RevealOnScroll';

export default function ContactPage() {
  const { t } = useLanguage();
  usePageMeta({
    title: t('meta.contactTitle'),
    description: t('meta.contactDesc'),
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
    <div className="flex flex-col bg-theme-main transition-colors duration-200">
      {/* 1. INTRO HEADING */}
      <section
        aria-label="Contact Coco Hotel Header"
        className="bg-theme-secondary text-theme-main py-16 sm:py-24 border-b border-theme transition-colors duration-200"
      >
        <Container className="text-center">
          <RevealOnScroll variant="up">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-theme-gold mb-3">
              {t('contact.conciergeSubtitle')}
            </p>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-theme-main tracking-tight mb-4">
              {t('contact.title')}
            </h1>
            <p className="text-base sm:text-lg text-theme-muted font-light max-w-2xl mx-auto leading-relaxed">
              {t('contact.intro')}
            </p>
          </RevealOnScroll>
        </Container>
      </section>

      {/* 2. HOTEL CONTACT INFORMATION CARDS */}
      <section aria-label="Hotel Contact Details" className="py-12 sm:py-16 bg-theme-main border-b border-theme">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Phone */}
            <RevealOnScroll variant="up" delay={0}>
              <div className="p-6 bg-theme-surface border border-theme rounded-xs flex flex-col justify-between hover:border-[var(--color-gold)] transition-all duration-300 shadow-sm h-full">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-theme-gold block mb-2">
                    {t('contact.telephone')}
                  </span>
                  <h2 className="text-lg font-serif font-bold text-theme-main mb-3">
                    {t('contact.directInquiries')}
                  </h2>
                  <div className="space-y-1 text-sm text-theme-muted">
                    {phone ? (
                      <p>
                        <a href={`tel:${phone}`} className="hover:text-theme-gold font-medium transition-colors">
                          {phone}
                        </a>
                      </p>
                    ) : (
                      <p className="text-theme-subtle">Available at front desk</p>
                    )}
                    {secondaryPhone && (
                      <p className="text-xs text-theme-subtle">
                        Alt: <a href={`tel:${secondaryPhone}`} className="hover:text-theme-gold transition-colors">{secondaryPhone}</a>
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-theme-subtle mt-4 pt-3 border-t border-theme">
                  {t('contact.frontDeskSupport')}
                </p>
              </div>
            </RevealOnScroll>

            {/* Email */}
            <RevealOnScroll variant="up" delay={80}>
              <div className="p-6 bg-theme-surface border border-theme rounded-xs flex flex-col justify-between hover:border-[var(--color-gold)] transition-all duration-300 shadow-sm h-full">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-theme-gold block mb-2">
                    {t('contact.email')}
                  </span>
                  <h2 className="text-lg font-serif font-bold text-theme-main mb-3">
                    {t('contact.electronicCorresp')}
                  </h2>
                  <div className="text-sm text-theme-muted">
                    {email ? (
                      <p className="break-all">
                        <a href={`mailto:${email}`} className="hover:text-theme-gold font-medium transition-colors">
                          {email}
                        </a>
                      </p>
                    ) : (
                      <p className="text-theme-subtle">Inquiries welcome</p>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-theme-subtle mt-4 pt-3 border-t border-theme">
                  {t('contact.promptReply')}
                </p>
              </div>
            </RevealOnScroll>

            {/* Address */}
            <RevealOnScroll variant="up" delay={160}>
              <div className="p-6 bg-theme-surface border border-theme rounded-xs flex flex-col justify-between hover:border-[var(--color-gold)] transition-all duration-300 shadow-sm h-full">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-theme-gold block mb-2">
                    {t('contact.location')}
                  </span>
                  <h2 className="text-lg font-serif font-bold text-theme-main mb-3">
                    {t('contact.physicalAddress')}
                  </h2>
                  <div className="text-sm text-theme-muted leading-relaxed">
                    {address ? (
                      <p>{address}</p>
                    ) : (
                      <p className="text-theme-subtle">{hotelName}</p>
                    )}
                  </div>
                </div>
                {mapUrl && (
                  <div className="mt-4 pt-3 border-t border-theme">
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-theme-gold hover:underline inline-flex items-center gap-1 transition-colors"
                    >
                      {t('contact.openInMaps')} &rarr;
                    </a>
                  </div>
                )}
              </div>
            </RevealOnScroll>

            {/* Check-In / Check-Out */}
            <RevealOnScroll variant="up" delay={240}>
              <div className="p-6 bg-theme-surface border border-theme rounded-xs flex flex-col justify-between hover:border-[var(--color-gold)] transition-all duration-300 shadow-sm h-full">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-theme-gold block mb-2">
                    {t('contact.hoursTiming')}
                  </span>
                  <h2 className="text-lg font-serif font-bold text-theme-main mb-3">
                    {t('contact.staySchedule')}
                  </h2>
                  <div className="space-y-2 text-sm text-theme-muted">
                    <div>
                      <span className="text-xs text-theme-subtle block uppercase tracking-wider">{t('booking.checkIn')}</span>
                      <span className="font-semibold text-theme-main">
                        {checkInTime || 'From 14:00'}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-theme-subtle block uppercase tracking-wider">{t('booking.checkOut')}</span>
                      <span className="font-semibold text-theme-main">
                        {checkOutTime || 'Until 12:00'}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-theme-subtle mt-4 pt-3 border-t border-theme">
                  {t('contact.reception247')}
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </Container>
      </section>

      {/* 3 & 4. GUEST FORMS (CONTACT MESSAGE & CALLBACK REQUEST) */}
      <section aria-label="Guest Inquiries and Callback Requests" className="py-16 sm:py-24 bg-theme-main">
        <Container>
          <RevealOnScroll variant="up">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-theme-gold mb-2">
                {t('contact.getInTouch')}
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-theme-main tracking-tight mb-4">
                {t('contact.howMayWeHelp')}
              </h2>
              <p className="text-sm text-theme-muted leading-relaxed">
                {t('contact.howMayWeHelpDesc')}
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Contact Message Form */}
            <RevealOnScroll variant="left">
              <ContactForm />
            </RevealOnScroll>

            {/* Callback Request Form */}
            <RevealOnScroll variant="right" delay={150}>
              <CallbackForm />
            </RevealOnScroll>
          </div>
        </Container>
      </section>

      {/* 5. LOCATION / DIRECTIONS AREA */}
      {(address || mapUrl) && (
        <section
          aria-label="Location and Directions"
          className="py-16 sm:py-20 bg-theme-secondary text-theme-main border-t border-theme transition-colors duration-200"
        >
          <Container>
            <RevealOnScroll variant="up">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-theme-gold block">
                  {t('contact.findingHotel')} {hotelName}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-theme-main">
                  {t('contact.directionsTitle')}
                </h2>
                {address && (
                  <p className="text-theme-muted text-base leading-relaxed">
                    {address}
                  </p>
                )}
                <p className="text-sm text-theme-muted leading-relaxed max-w-xl mx-auto font-light">
                  {t('contact.directionsDesc')}
                </p>
                {mapUrl && (
                  <div className="pt-2">
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-theme-gold text-stone-950 rounded-xs hover:brightness-110 active:brightness-95 transition-all shadow-sm focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
                    >
                      {t('contact.viewInteractiveMap')} &rarr;
                    </a>
                  </div>
                )}
              </div>
            </RevealOnScroll>
          </Container>
        </section>
      )}
    </div>
  );
}
