import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

const HomePage = lazy(() => import('./pages/HomePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const CompanyDetailPage = lazy(() => import('./pages/CompanyDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

export default function App() {
  return (
    <Suspense fallback={<div className="page-loader" />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/companies/:slug" element={<CompanyDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
