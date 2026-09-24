import { Outlet } from 'react-router-dom';
import HotelProvider from '../context/HotelProvider';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function MainLayout() {
  return (
    <HotelProvider>
      <div className="min-h-screen flex flex-col bg-stone-50 text-stone-800 antialiased selection:bg-amber-100 selection:text-amber-900">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </HotelProvider>
  );
}
