// frontend/src/components/LaporanList.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const LaporanList = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [returnedBooks, setReturnedBooks] = useState([]);
    const [monthlyStats, setMonthlyStats] = useState([]);
    const [activeMembers, setActiveMembers] = useState([]);
    const [averageBorrowDuration, setAverageBorrowDuration] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllReports();
    }, []);

    const fetchAllReports = async () => {
        try {
            const [
                borrowedRes,
                returnedRes,
                monthlyRes,
                activeMembersRes,
                avgDurationRes
            ] = await Promise.all([
                api.get('/buku/report/borrowed'),
                api.get('/buku/report/returned'),
                api.get('/buku/report/monthly-stats'),
                api.get('/anggota/report/active-members'),
                api.get('/pinjaman/report/average-duration')
            ]);
            setBorrowedBooks(borrowedRes.data);
            setReturnedBooks(returnedRes.data);
            setMonthlyStats(monthlyRes.data);
            setActiveMembers(activeMembersRes.data);
            setAverageBorrowDuration(avgDurationRes.data.RataRataLamaPinjamHari);
        } catch (err) {
            console.error('Error fetching reports:', err);
            setError('Gagal memuat laporan.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container">
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="loading-spinner"></div>
                    <p style={{ marginTop: '1rem', color: 'var(--text-color)' }}>Memuat laporan...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    return (
        <div className="container">
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ 
                    color: 'var(--primary-color)',
                    fontSize: '1.75rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem'
                }}>
                    Laporan Perpustakaan
                </h2>
                <p style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                    Ringkasan statistik dan aktivitas perpustakaan
                </p>
            </div>

            {/* Statistik Cards */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <div className="card" style={{ 
                    background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                    color: 'white'
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9 }}>Total Peminjaman Aktif</h3>
                    <p style={{ 
                        margin: '0.5rem 0 0 0',
                        fontSize: '2rem',
                        fontWeight: '600'
                    }}>
                        {borrowedBooks.length}
                    </p>
                </div>

                <div className="card" style={{ 
                    background: 'linear-gradient(135deg, #059669, #047857)',
                    color: 'white'
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9 }}>Total Pengembalian</h3>
                    <p style={{ 
                        margin: '0.5rem 0 0 0',
                        fontSize: '2rem',
                        fontWeight: '600'
                    }}>
                        {returnedBooks.length}
                    </p>
                </div>

                <div className="card" style={{ 
                    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                    color: 'white'
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9 }}>Rata-rata Lama Pinjam</h3>
                    <p style={{ 
                        margin: '0.5rem 0 0 0',
                        fontSize: '2rem',
                        fontWeight: '600'
                    }}>
                        {Math.round(averageBorrowDuration)} hari
                    </p>
                </div>
            </div>

            {/* Buku yang Sedang Dipinjam */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    borderBottom: '2px solid var(--border-color)',
                    paddingBottom: '1rem'
                }}>
                    <h3 style={{ margin: 0, color: 'var(--text-color)' }}>Buku yang Sedang Dipinjam</h3>
                    <span style={{ 
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem'
                    }}>
                        {borrowedBooks.length} buku
                    </span>
                </div>

                {borrowedBooks.length === 0 ? (
                    <p style={{ color: 'var(--text-color)', opacity: 0.7 }}>Tidak ada buku yang sedang dipinjam.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Judul</th>
                                    <th>Penulis</th>
                                    <th>Peminjam</th>
                                    <th>Tgl Pinjam</th>
                                    <th>Tgl Jatuh Tempo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrowedBooks.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.Judul}</td>
                                        <td>{item.Penulis}</td>
                                        <td>{item.Peminjam}</td>
                                        <td>{new Date(item.TanggalPinjam).toLocaleDateString()}</td>
                                        <td>{new Date(item.TanggalJatuhTempo).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Buku yang Sudah Dikembalikan */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    borderBottom: '2px solid var(--border-color)',
                    paddingBottom: '1rem'
                }}>
                    <h3 style={{ margin: 0, color: 'var(--text-color)' }}>Buku yang Sudah Dikembalikan</h3>
                    <span style={{ 
                        backgroundColor: '#059669',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem'
                    }}>
                        {returnedBooks.length} buku
                    </span>
                </div>

                {returnedBooks.length === 0 ? (
                    <p style={{ color: 'var(--text-color)', opacity: 0.7 }}>Tidak ada buku yang sudah dikembalikan.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Judul</th>
                                    <th>Penulis</th>
                                    <th>Peminjam</th>
                                    <th>Tgl Pinjam</th>
                                    <th>Tgl Kembali</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {returnedBooks.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.Judul}</td>
                                        <td>{item.Penulis}</td>
                                        <td>{item.Peminjam}</td>
                                        <td>{new Date(item.TanggalPinjam).toLocaleDateString()}</td>
                                        <td>{new Date(item.TanggalKembali).toLocaleDateString()}</td>
                                        <td>
                                            <span style={{
                                                backgroundColor: item.Status === 'Tepat Waktu' ? '#059669' : '#dc2626',
                                                color: 'white',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.875rem'
                                            }}>
                                                {item.Status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Statistik Peminjaman per Bulan */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    borderBottom: '2px solid var(--border-color)',
                    paddingBottom: '1rem'
                }}>
                    <h3 style={{ margin: 0, color: 'var(--text-color)' }}>Statistik Peminjaman per Bulan</h3>
                    <span style={{ 
                        backgroundColor: '#059669',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem'
                    }}>
                        {monthlyStats.length} bulan
                    </span>
                </div>

                {monthlyStats.length === 0 ? (
                    <p style={{ color: 'var(--text-color)', opacity: 0.7 }}>Tidak ada data statistik peminjaman.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Bulan</th>
                                    <th>Jumlah Peminjaman</th>
                                </tr>
                            </thead>
                            <tbody>
                                {monthlyStats.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.Bulan}</td>
                                        <td>{item.JumlahPeminjaman}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Peminjam Buku Paling Aktif */}
            <div className="card">
                <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    borderBottom: '2px solid var(--border-color)',
                    paddingBottom: '1rem'
                }}>
                    <h3 style={{ margin: 0, color: 'var(--text-color)' }}>Peminjam Buku Paling Aktif</h3>
                    <span style={{ 
                        backgroundColor: '#7c3aed',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem'
                    }}>
                        Top {activeMembers.length} peminjam
                    </span>
                </div>

                {activeMembers.length === 0 ? (
                    <p style={{ color: 'var(--text-color)', opacity: 0.7 }}>Tidak ada data peminjam aktif.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Nama Peminjam</th>
                                    <th>Total Peminjaman</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeMembers.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.NamaPeminjam}</td>
                                        <td>{item.TotalPeminjaman}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LaporanList;
