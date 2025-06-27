// frontend/src/components/PinjamanForm.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const PinjamanForm = ({ onPinjamanAdded }) => {
    const [anggotaList, setAnggotaList] = useState([]);
    const [bukuList, setBukuList] = useState([]);
    const [selectedAnggota, setSelectedAnggota] = useState('');
    const [selectedBuku, setSelectedBuku] = useState('');
    const [tanggalPinjam, setTanggalPinjam] = useState(new Date().toISOString().split('T')[0]);
    const [tanggalJatuhTempo, setTanggalJatuhTempo] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAnggotaAndBuku();
    }, []);

    // Hitung tanggal jatuh tempo (7 hari setelah tanggal pinjam)
    useEffect(() => {
        if (tanggalPinjam) {
            const pinjamDate = new Date(tanggalPinjam);
            const jatuhTempoDate = new Date(pinjamDate);
            jatuhTempoDate.setDate(pinjamDate.getDate() + 7);
            setTanggalJatuhTempo(jatuhTempoDate.toISOString().split('T')[0]);
        }
    }, [tanggalPinjam]);

    const fetchAnggotaAndBuku = async () => {
        try {
            const [anggotaRes, bukuRes] = await Promise.all([
                api.get('/anggota'),
                api.get('/buku')
            ]);
            setAnggotaList(anggotaRes.data);
            setBukuList(bukuRes.data.filter(b => b.Stok > 0));
        } catch (err) {
            console.error('Error fetching data for form:', err);
            setMessage('Gagal memuat data untuk formulir.');
            setMessageType('error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setMessageType('');
        setLoading(true);

        if (!selectedAnggota || !selectedBuku || !tanggalPinjam) {
            setMessage('Semua field harus diisi.');
            setMessageType('error');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/pinjaman/borrow', {
                AnggotaID: parseInt(selectedAnggota),
                BukuID: parseInt(selectedBuku),
                TanggalPinjam: tanggalPinjam,
                TanggalJatuhTempo: tanggalJatuhTempo
            });
            setMessage(response.data.message);
            setMessageType('success');
            setSelectedAnggota('');
            setSelectedBuku('');
            setTanggalPinjam(new Date().toISOString().split('T')[0]);
            if (onPinjamanAdded) {
                onPinjamanAdded();
            }
            fetchAnggotaAndBuku();
        } catch (err) {
            console.error('Error adding borrowing:', err);
            setMessage(err.response?.data?.message || 'Gagal menambah pinjaman.');
            setMessageType('error');
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
                        Pinjam Buku Baru
                    </h2>
                    <p style={{ 
                        color: 'var(--text-color)',
                        opacity: 0.8,
                        marginTop: '0.5rem'
                    }}>
                        Isi formulir di bawah untuk meminjam buku
                    </p>
                </div>

                {message && (
                    <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1rem',
                        marginBottom: '1.5rem'
                    }}>
                        <div className="form-group">
                            <label className="form-label">Anggota</label>
                            <select
                                className="form-control"
                                value={selectedAnggota}
                                onChange={(e) => setSelectedAnggota(e.target.value)}
                                required
                                style={{ height: '42px' }}
                            >
                                <option value="">Pilih Anggota</option>
                                {anggotaList.map((anggota) => (
                                    <option key={anggota.AnggotaID} value={anggota.AnggotaID}>
                                        {anggota.Nama}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Buku</label>
                            <select
                                className="form-control"
                                value={selectedBuku}
                                onChange={(e) => setSelectedBuku(e.target.value)}
                                required
                                style={{ height: '42px' }}
                            >
                                <option value="">Pilih Buku</option>
                                {bukuList.map((buku) => (
                                    <option key={buku.BukuID} value={buku.BukuID}>
                                        {buku.Judul} oleh {buku.Penulis} (Stok: {buku.Stok})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1rem',
                        marginBottom: '1.5rem'
                    }}>
                        <div className="form-group">
                            <label className="form-label">Tanggal Pinjam</label>
                            <input
                                type="date"
                                className="form-control"
                                value={tanggalPinjam}
                                onChange={(e) => setTanggalPinjam(e.target.value)}
                                required
                                style={{ height: '42px' }}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Tanggal Jatuh Tempo</label>
                            <input
                                type="date"
                                className="form-control"
                                value={tanggalJatuhTempo}
                                disabled
                                style={{ 
                                    height: '42px',
                                    backgroundColor: 'var(--background-color)',
                                    cursor: 'not-allowed'
                                }}
                            />
                            <small style={{ 
                                color: 'var(--text-color)',
                                opacity: 0.7,
                                marginTop: '0.25rem',
                                display: 'block'
                            }}>
                                Jatuh tempo dihitung otomatis 7 hari setelah tanggal pinjam
                            </small>
                        </div>
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
                            ) : 'Pinjam Buku'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PinjamanForm;
