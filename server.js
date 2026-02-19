const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint webhook utama
app.post('/log', (req, res) => {
    const hit = {
        ...req.body,
        receivedAt: new Date().toISOString()
    };

    console.log('🎯 NEW HIT:', hit.ip, hit.city || 'Unknown');

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