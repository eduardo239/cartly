import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import FavoritesPage from './pages/FavoritesPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="buscar" element={<HomePage focusSearch />} />
          <Route path="produto/:id" element={<ProductPage />} />
          <Route path="favoritos" element={<FavoritesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="perfil" element={<ProfilePage />} />
      </Routes>
    </>
  );
}
