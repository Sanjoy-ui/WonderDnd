import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ListingDetail from './pages/ListingDetail';
import NewListing from './pages/NewListing';
import EditListing from './pages/EditListing';

export default function App() {
  const navigate = useNavigate();

  const handleGlobalSearch = (term) => {
    if (term) {
      navigate(`/?search=${encodeURIComponent(term)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <Navbar onSearch={handleGlobalSearch} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Home />} />
          <Route path="/listings/new" element={<NewListing />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/listings/:id/edit" element={<EditListing />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
