// frontend/src/components/AnggotaList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AnggotaList() {
    const [anggota, setAnggota] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnggota();
    }, []);

    const fetchAnggota = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/anggota');
            setAnggota(response.data);
            setLoading(false);
        } catch (err) {
            setError('Gagal memuat data anggota');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="card">
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div className="loading-spinner"></div>
                    <p>Memuat data anggota...</p>
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
                <h2 className="buku-title">Daftar Anggota</h2>
                <span className="badge badge-total">Total: {anggota.length} anggota</span>
            </div>
            <div className="table-responsive">
                <table className="table buku-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nama</th>
                            <th>Alamat</th>
                            <th>No. Telepon</th>
                        </tr>
                    </thead>
                    <tbody>
                        {anggota.map((a, idx) => (
                            <tr key={a.AnggotaID} className={idx % 2 === 1 ? 'table-zebra' : ''}>
                                <td>{a.AnggotaID}</td>
                                <td>{a.Nama}</td>
                                <td>{a.Alamat}</td>
                                <td>{a.Telepon}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AnggotaList;
