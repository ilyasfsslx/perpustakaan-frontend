// frontend/src/components/PengembalianForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PengembalianForm() {
    const [formData, setFormData] = useState({
        id_pinjaman: '',
        tanggal_kembali: new Date().toISOString().split('T')[0],
        status: 'Dikembalikan'
    });

    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [selectedPinjaman, setSelectedPinjaman] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchBorrowedBooks();
    }, []);

    const fetchBorrowedBooks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/buku/report/borrowed');
            setBorrowedBooks(response.data);
        } catch (err) {
            setError('Gagal memuat data peminjaman');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'id_pinjaman') {
            const selected = borrowedBooks.find(p => p.PinjamanID === parseInt(value));
            setSelectedPinjaman(selected);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axios.post('http://localhost:5000/api/pinjaman/return', {
                PinjamanID: parseInt(formData.id_pinjaman),
                TanggalKembali: formData.tanggal_kembali
            });
            
            setSuccess(true);
            setFormData({
                id_pinjaman: '',
                tanggal_kembali: new Date().toISOString().split('T')[0],
                status: 'Dikembalikan'
            });
            setSelectedPinjaman(null);
            
            // Refresh data peminjaman
            fetchBorrowedBooks();
            
            // Tampilkan pesan sukses dengan informasi denda jika ada
            if (response.data.dendaDikenakan) {
                setMessage(`Pengembalian berhasil! Denda keterlambatan telah dikenakan.`);
            } else {
                setMessage('Pengembalian berhasil!');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal menambahkan data pengembalian');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ 
                    borderBottom: '2px solid var(--border-color)', 
                    paddingBottom: '1rem',
                    marginBottom: '1.5rem'
                }}>
                    <h2 style={{ 
                        color: 'var(--primary-color)',
                        margin: 0,
                        fontSize: '1.75rem',
                        fontWeight: '600'
                    }}>
                        Pengembalian Buku
                    </h2>
                    <p style={{ 
                        color: 'var(--text-color)',
                        opacity: 0.8,
                        marginTop: '0.5rem'
                    }}>
                        Proses pengembalian buku yang dipinjam
                    </p>
                </div>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Pilih Peminjaman</label>
                        <select
                            name="id_pinjaman"
                            value={formData.id_pinjaman}
                            onChange={handleChange}
                            className="form-control"
                            required
                            style={{ height: '42px' }}
                        >
                            <option value="">Pilih Peminjaman</option>
                            {borrowedBooks.map(p => (
                                <option key={p.PinjamanID} value={p.PinjamanID}>
                                    {p.Judul} - {p.Peminjam} (ID: {p.PinjamanID})
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedPinjaman && (
                        <div className="card" style={{ 
                            marginBottom: '1.5rem',
                            backgroundColor: 'var(--background-color)',
                            padding: '1.5rem',
                            border: '1px solid var(--border-color)'
                        }}>
                            <h3 style={{ 
                                margin: '0 0 1rem 0', 
                                fontSize: '1.1rem',
                                color: 'var(--text-color)'
                            }}>
                                Detail Peminjaman
                            </h3>
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1rem'
                            }}>
                                <div>
                                    <p style={{ 
                                        margin: '0.5rem 0',
                                        fontSize: '0.9rem',
                                        color: 'var(--text-color)'
                                    }}>
                                        <strong>Anggota:</strong> {selectedPinjaman.Peminjam}
                                    </p>
                                    <p style={{ 
                                        margin: '0.5rem 0',
                                        fontSize: '0.9rem',
                                        color: 'var(--text-color)'
                                    }}>
                                        <strong>Buku:</strong> {selectedPinjaman.Judul}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ 
                                        margin: '0.5rem 0',
                                        fontSize: '0.9rem',
                                        color: 'var(--text-color)'
                                    }}>
                                        <strong>Tanggal Pinjam:</strong> {new Date(selectedPinjaman.TanggalPinjam).toLocaleDateString()}
                                    </p>
                                    <p style={{ 
                                        margin: '0.5rem 0',
                                        fontSize: '0.9rem',
                                        color: 'var(--text-color)'
                                    }}>
                                        <strong>Jatuh Tempo:</strong> {new Date(selectedPinjaman.TanggalJatuhTempo).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Tanggal Kembali</label>
                        <input
                            type="date"
                            name="tanggal_kembali"
                            value={formData.tanggal_kembali}
                            onChange={handleChange}
                            className="form-control"
                            required
                            style={{ height: '42px' }}
                        />
                    </div>

                    <div style={{ 
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '2rem'
                    }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ 
                                minWidth: '150px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {loading ? (
                                <>
                                    <div className="loading-spinner" style={{ 
                                        width: '20px', 
                                        height: '20px', 
                                        borderWidth: '2px',
                                        margin: 0
                                    }}></div>
                                    Memproses...
                                </>
                            ) : 'Kembalikan Buku'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PengembalianForm;
