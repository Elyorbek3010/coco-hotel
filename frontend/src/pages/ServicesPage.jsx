import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { getServices } from '../api/hotel';
import Container from '../components/common/Container';
import SectionTitle from '../components/common/SectionTitle';
import ServiceIcon from '../components/common/ServiceIcon';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';

export default function ServicesPage() {
  usePageMeta({
    title: 'Services',
    description: 'Explore the services available to Coco Hotel guests.',
    canonicalPath: '/services',
  });

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    getServices()
      .then((data) => {
        setServices(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    getServices()
      .then((data) => {
        if (isMounted) {
          setServices(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col">
      {/* 1. HERO HEADER */}
      <section
        aria-label="Services Header"
        className="bg-stone-900 text-white py-16 sm:py-24 border-b border-stone-800"
      >
        <Container className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-3">
            Guest Amenities
          </p>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight mb-4">
            Services &amp; Comforts
          </h1>
          <p className="text-base sm:text-lg text-stone-300 font-light max-w-2xl mx-auto leading-relaxed">
            Thoughtfully curated amenities designed to ensure every moment of your stay is effortless, comfortable, and restorative.
          </p>
        </Container>
      </section>

      {/* 2. SERVICES CONTENT */}
      <section aria-label="Services List" className="py-16 sm:py-24">
        <Container>
          {loading ? (
            <LoadingState message="Loading hotel services..." />
          ) : error ? (
            <ErrorState
              title="Unable to load services"
              message="We could not retrieve the hotel services list at this time. Please try again."
              onRetry={handleRetry}
            />
          ) : services.length === 0 ? (
            <div className="text-center py-16 px-6 bg-stone-50 border border-stone-200 rounded-sm max-w-xl mx-auto">
              <h2 className="font-serif text-xl font-semibold text-stone-900 mb-2">
                Amenities Catalogue Updating
              </h2>
              <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                Our active hotel services information is currently being updated. Please contact our front desk directly for any amenity inquiries.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white rounded-sm hover:bg-stone-800 transition-colors"
              >
                Contact Front Desk
              </Link>
            </div>
          ) : (
            <div className="space-y-16">
              <div>
                <SectionTitle
                  subtitle="Complimentary &amp; On-Site"
                  title="What We Offer Our Guests"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="p-8 bg-white border border-stone-200 rounded-sm hover:border-amber-700/40 hover:shadow-xs transition-all flex flex-col"
                    >
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-amber-50 text-amber-800 mb-5">
                        <ServiceIcon name={service.icon || service.name} className="w-6 h-6" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                        {service.name}
                      </h3>
                      {service.description ? (
                        <p className="text-sm text-stone-600 leading-relaxed">
                          {service.description}
                        </p>
                      ) : (
                        <p className="text-xs text-stone-400 italic">
                          Included for all registered hotel guests.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Inquiry & Booking Callout */}
              <div className="p-8 sm:p-10 bg-stone-100/80 border border-stone-200 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl space-y-2">
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    Need Any Special Arrangements?
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Whether you require specific arrival timings, quiet room preferences, or personal assistance, our team is always ready to accommodate your needs.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 shrink-0">
                  <Link
                    to="/booking"
                    className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-amber-700 text-white rounded-sm hover:bg-amber-800 transition-colors focus-visible:outline-2 focus-visible:outline-amber-700"
                  >
                    Book Your Stay
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-wider border border-stone-300 text-stone-800 hover:bg-stone-50 rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-stone-500"
                  >
                    Contact Concierge
                  </Link>
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
