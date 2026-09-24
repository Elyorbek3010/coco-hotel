import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import HotelProvider from '../context/HotelProvider';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import LoadingState from '../components/common/LoadingState';
import HotelJsonLd from '../components/seo/HotelJsonLd';

function RouteLoadingFallback() {
  return (
    <div
      className="py-24 sm:py-32 flex justify-center items-center min-h-[50vh] bg-[#0c0a09]"
      role="status"
      aria-live="polite"
    >
      <LoadingState message="Loading..." />
    </div>
  );
}

export default function MainLayout() {
  return (
    <HotelProvider>
      <HotelJsonLd />
      <div className="min-h-screen flex flex-col bg-[#0c0a09] text-stone-200 antialiased selection:bg-[#c5a880] selection:text-[#0c0a09]">
        <Header />
        <main className="flex-1">
          <Suspense fallback={<RouteLoadingFallback />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
    </HotelProvider>
  );
}
