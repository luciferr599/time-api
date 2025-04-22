const express = require('express');
const app = express();

// Endpoint untuk menambahkan hari
app.get('/api/add_days', (req, res) => {
    const { tanggal, jumlah_hari } = req.query;

    if (!tanggal || !jumlah_hari) {
        return res.status(400).json({ error: 'Tanggal dan jumlah_hari harus disediakan' });
    }

    // Validasi format tanggal (YYYY-MM-DD)
    const date = new Date(tanggal);
    if (isNaN(date.getTime())) {
        return res.status(400).json({ error: 'Format tanggal tidak valid. Harus YYYY-MM-DD' });
    }

    // Validasi jumlah_hari sebagai angka
    const daysToAdd = parseInt(jumlah_hari);
    if (isNaN(daysToAdd)) {
        return res.status(400).json({ error: 'Jumlah hari harus berupa angka' });
    }

    // Tambahkan jumlah hari
    date.setDate(date.getDate() + daysToAdd);

    // Kembalikan tanggal baru dalam format YYYY-MM-DD
    const newDate = date.toISOString().split('T')[0];
    return res.json({ tanggal_baru: newDate });
});

// Export untuk Vercel
module.exports = app;
