const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// In-memory logs for the demo
const logs = {
    sos: [],
    alerts: [],
    services: []
};

// Endpoints
app.get('/api/status', (req, res) => {
    res.json({ status: 'SentinelNet Backend Online', timestamp: new Date() });
});

// Trigger a new alert (Authority Dashboard)
app.post('/api/alert/trigger', (req, res) => {
    const { type, severity, zone, instructions } = req.body;
    const alert = {
        id: Date.now(),
        type,
        severity,
        zone, // { center: { lat, lng }, radius: meters }
        instructions,
        timestamp: new Date()
    };

    logs.alerts.push(alert);

    // Broadcast to all clients
    io.emit('new_alert', alert);

    console.log(`[ALERT] Broadast: ${type} (${severity})`);
    res.status(201).json(alert);
});

// SOS Management
app.post('/api/sos/start', (req, res) => {
    const { userId, location } = req.body;
    const entry = { userId, location, timestamp: new Date(), status: 'ACTIVE' };
    logs.sos.push(entry);
    console.log(`[SOS] Started for user ${userId} at ${JSON.stringify(location)}`);
    res.json({ status: 'SOS_LOGGED', entry });
});

app.post('/api/sos/stop', (req, res) => {
    const { userId } = req.body;
    console.log(`[SOS] Stopped for user ${userId}`);
    res.json({ status: 'SOS_RESOLVED' });
});

// Emergency Service Request
app.post('/api/service/request', (req, res) => {
    const { service, location, userId } = req.body;
    const request = { service, location, userId, timestamp: new Date() };
    logs.services.push(request);
    console.log(`[SERVICE] Request: ${service} for user ${userId}`);
    res.json({ status: 'REQUEST_LOGGED', service });
});

// Get all logs (for admin visibility)
app.get('/api/admin/logs', (req, res) => {
    res.json(logs);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`SentinelNet Backend running on port ${PORT}`);
});
