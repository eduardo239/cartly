import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import AdminShell from './components/admin/AdminShell';
import Layout from './components/Layout';
import FavoritesPage from './pages/FavoritesPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';

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
        <Route path="admin" element={<AdminShell />}>
          <Route index element={<AdminProductsPage />} />
          <Route path="produtos/novo" element={<AdminProductFormPage />} />
          <Route path="produtos/:id" element={<AdminProductFormPage />} />
        </Route>
      </Routes>
    </>
  );
}
