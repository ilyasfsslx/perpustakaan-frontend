// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BukuList from './components/BukuList';
import AnggotaList from './components/AnggotaList';
import PinjamanForm from './components/PinjamanForm';
import PengembalianForm from './components/PengembalianForm';
import LaporanList from './components/LaporanList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar modern-navbar">
          <div className="container navbar-flex">
            <div className="navbar-left">
              <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span>Perpustakaan Digital</span>
              </Link>
            </div>
            <div className="navbar-right">
              <Link to="/buku" className="nav-link">Buku</Link>
              <Link to="/anggota" className="nav-link">Anggota</Link>
              <Link to="/pinjam" className="nav-link">Pinjam Buku</Link>
              <Link to="/kembali" className="nav-link">Kembalikan Buku</Link>
              <Link to="/laporan" className="nav-link">Laporan</Link>
            </div>
          </div>
        </nav>

        <main className="container">
          <Routes>
            <Route path="/" element={
              <div className="landing-card">
                <div className="landing-content">
                  <h1 className="landing-title">
                    Selamat Datang di Perpustakaan Digital
                  </h1>
                  <p className="landing-desc">
                    Sistem manajemen perpustakaan digital yang memudahkan pengelolaan buku, anggota, dan transaksi peminjaman
                  </p>
                  <div className="landing-menu">
                    <Link to="/buku" className="landing-menu-card">
                      <div className="landing-menu-icon">📚</div>
                      <h3>Katalog Buku</h3>
                      <p>Lihat dan kelola koleksi buku perpustakaan</p>
                    </Link>
                    <Link to="/pinjam" className="landing-menu-card">
                      <div className="landing-menu-icon">📖</div>
                      <h3>Pinjam Buku</h3>
                      <p>Proses peminjaman buku dengan mudah</p>
                    </Link>
                    <Link to="/laporan" className="landing-menu-card">
                      <div className="landing-menu-icon">📊</div>
                      <h3>Laporan</h3>
                      <p>Pantau statistik dan aktivitas perpustakaan</p>
                    </Link>
                  </div>
                </div>
              </div>
            } />
            <Route path="/buku" element={<BukuList />} />
            <Route path="/anggota" element={<AnggotaList />} />
            <Route path="/pinjam" element={<PinjamanForm />} />
            <Route path="/kembali" element={<PengembalianForm />} />
            <Route path="/laporan" element={<LaporanList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
