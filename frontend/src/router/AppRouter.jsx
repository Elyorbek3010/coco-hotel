import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import RoomsPage from '../pages/RoomsPage';
import RoomDetailPage from '../pages/RoomDetailPage';
import AboutPage from '../pages/AboutPage';
import ServicesPage from '../pages/ServicesPage';
import GalleryPage from '../pages/GalleryPage';
import PromotionsPage from '../pages/PromotionsPage';
import ContactPage from '../pages/ContactPage';
import BookingPage from '../pages/BookingPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="rooms/:slug" element={<RoomDetailPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="promotions" element={<PromotionsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="booking" element={<BookingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
