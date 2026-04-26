const express = require('express');
const si = require('systeminformation');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());

// --- KONFIGURASI FILE MANAGER ---
const ROOT_DIR = '/home/yus/api-server/uploads'; 
if (!fs.existsSync(ROOT_DIR)) fs.mkdirSync(ROOT_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, ROOT_DIR),
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// --- API MONITORING (DENGAN SPEED & HEALTH) ---
app.get('/api/stats', async (req, res) => {
    try {
        const [cpu, cpuSpeed, temp, mem, battery, fsSize, time, net, io] = await Promise.all([
            si.cpu(), si.cpuCurrentSpeed(), si.cpuTemperature(), 
            si.mem(), si.battery(), si.fsSize(), si.time(),
            si.networkStats(), si.fsStats()
        ]);
        
        const h = Math.floor(time.uptime / 3600);
        const m = Math.floor((time.uptime % 3600) / 60);

        res.json({
            cpuModel: cpu.brand,
            cores: cpu.cores,
            clockSpeed: cpuSpeed.avg,
            temp: temp.main || '--',
            ramUsed: (mem.active / 1024 / 1024 / 1024).toFixed(1),
            ramTotal: (mem.total / 1024 / 1024 / 1024).toFixed(1),
            ramPercent: (mem.active / mem.total * 100).toFixed(1),
            diskUsed: (fsSize[0]?.used / 1024 / 1024 / 1024).toFixed(1) || 0,
            diskTotal: (fsSize[0]?.size / 1024 / 1024 / 1024).toFixed(1) || 0,
            // Speed Internet (Mbps)
            downSpeed: (net[0]?.rx_sec / 1024 / 1024 * 8).toFixed(2) || 0,
            upSpeed: (net[0]?.tx_sec / 1024 / 1024 * 8).toFixed(2) || 0,
            // Speed Disk (MB/s)
            diskRead: (io.rx_sec / 1024 / 1024).toFixed(2) || 0,
            diskWrite: (io.wx_sec / 1024 / 1024).toFixed(2) || 0,
            // Kesehatan Batre
            batHealth: battery.designCapacity > 0 ? ((battery.capacity / battery.designCapacity) * 100).toFixed(0) : 100,
            batPercent: battery.percent || 0,
            batWatt: (battery.currentCapacity > 100 ? (battery.currentCapacity / 1000) : (battery.currentCapacity || 0)).toFixed(1),
            uptime: `${h}h ${m}m`
        });
    } catch (e) { res.json({ error: e.message }); }
});

// --- API FILE MANAGER (YANG LU TULIS TADI) ---
app.get('/api/files', (req, res) => {
    fs.readdir(ROOT_DIR, (err, files) => {
        if (err) return res.json([]);
        const data = files.map(name => {
            const stats = fs.statSync(path.join(ROOT_DIR, name));
            return { name, size: (stats.size / 1024).toFixed(1) + ' KB' };
        });
        res.json(data);
    });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    res.json({ success: true });
});

app.delete('/api/delete/:name', (req, res) => {
    try {
        fs.unlinkSync(path.join(ROOT_DIR, req.params.name));
        res.json({ success: true });
    } catch (e) { res.json({ error: e.message }); }
});

app.get('/api/download/:name', (req, res) => {
    res.download(path.join(ROOT_DIR, req.params.name));
});

app.listen(3000, () => console.log('Server Gacor: Monitoring + File Manager Aktif!'));
