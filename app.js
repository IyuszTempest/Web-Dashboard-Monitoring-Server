const express = require('express');
const si = require('systeminformation');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');
const AdmZip = require('adm-zip');

const app = express();
app.use(cors());
app.use(express.json());

const ROOT_DIR = path.join(__dirname, 'uploads');

// --- API MONITORING (Dashboard) ---
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
            downSpeed: (net[0]?.rx_sec / 1024 / 1024 * 8).toFixed(2) || 0,
            upSpeed: (net[0]?.tx_sec / 1024 / 1024 * 8).toFixed(2) || 0,
            diskRead: (io.rx_sec / 1024 / 1024).toFixed(2) || 0,
            diskWrite: (io.wx_sec / 1024 / 1024).toFixed(2) || 0,
            batHealth: battery.designCapacity > 0 ? ((battery.capacity / battery.designCapacity) * 100).toFixed(0) : 100,
            batPercent: battery.percent || 0,
            batWatt: (battery.currentCapacity > 100 ? (battery.currentCapacity / 1000) : (battery.currentCapacity || 0)).toFixed(1),
            uptime: `${h}h ${m}m`
        });
    } catch (e) { res.json({ error: e.message }); }
});

// --- API FILE MANAGER ---
app.get('/api/files', async (req, res) => {
    const files = await fs.readdir(ROOT_DIR);
    const data = files.map(name => {
        const stats = fs.statSync(path.join(ROOT_DIR, name));
        return { name, size: (stats.size / 1024).toFixed(1) + ' KB', isDir: stats.isDirectory() };
    });
    res.json(data);
});

const upload = multer({ storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, ROOT_DIR),
    filename: (req, file, cb) => cb(null, file.originalname)
})});

app.post('/api/upload', upload.single('file'), (req, res) => res.json({ success: true }));

app.delete('/api/delete/:name', async (req, res) => {
    await fs.remove(path.join(ROOT_DIR, req.params.name));
    res.json({ success: true });
});

app.post('/api/extract', (req, res) => {
    const zip = new AdmZip(path.join(ROOT_DIR, req.body.name));
    zip.extractAllTo(ROOT_DIR, true);
    res.json({ success: true });
});

app.listen(3000, () => console.log('Super API Running on Port 3000'));
