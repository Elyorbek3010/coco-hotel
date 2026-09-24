import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-300 mt-auto border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-block focus-visible:outline-2 focus-visible:outline-amber-500 rounded-sm"
            >
              <span className="font-serif text-2xl tracking-widest text-white font-bold">
                COCO HOTEL
              </span>
            </Link>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              Your quiet corner of the city. Experience warm hospitality, refined comfort, and peaceful luxury.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/rooms" className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-amber-500 rounded-sm">
                  Rooms & Suites
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-amber-500 rounded-sm">
                  About the Hotel
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-amber-500 rounded-sm">
                  Services & Amenities
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-amber-500 rounded-sm">
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link to="/promotions" className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-amber-500 rounded-sm">
                  Special Offers
                </Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-amber-500 rounded-sm">
                  Reserve a Room
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Area Placeholder */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-4">
              Contact & Inquiries
            </h3>
            <div className="space-y-3 text-sm text-stone-400">
              <p>
                Have a question or request? Reach out to our concierge desk.
              </p>
              <div>
                <Link
                  to="/contact"
                  className="inline-flex items-center text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors focus-visible:outline-2 focus-visible:outline-amber-500 rounded-sm"
                >
                  Send a Message or Request Callback &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400">
          <p>&copy; {currentYear} Coco Hotel. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Refined hospitality & tranquil stay</p>
        </div>
      </div>
    </footer>
  );
}
