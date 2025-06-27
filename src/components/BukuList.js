// frontend/src/components/BukuList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BukuList() {
    const [buku, setBuku] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBuku();
    }, []);

    const fetchBuku = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/buku');
            setBuku(response.data);
            setLoading(false);
        } catch (err) {
            setError('Gagal memuat data buku');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="card">
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div className="loading-spinner"></div>
                    <p>Memuat data buku...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger">
                {error}
            </div>
        );
    }

    return (
        <div className="card">
            <div className="buku-header">
                <h2 className="buku-title">Daftar Buku</h2>
                <span className="badge badge-total">Total: {buku.length} buku</span>
            </div>
            <div className="table-responsive">
                <table className="table buku-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Judul</th>
                            <th>Pengarang</th>
                            <th>Penerbit</th>
                            <th>Tahun Terbit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {buku.map((b, idx) => (
                            <tr key={b.BukuID} className={idx % 2 === 1 ? 'table-zebra' : ''}>
                                <td>{b.BukuID}</td>
                                <td>{b.Judul}</td>
                                <td>{b.Penulis}</td>
                                <td>{b.Penerbit}</td>
                                <td>{b.TahunTerbit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BukuList;
