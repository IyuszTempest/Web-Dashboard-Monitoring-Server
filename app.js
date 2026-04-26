// app.js di antiX
const express = require('express');
const si = require('systeminformation');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Folder yang mau dikelola (Ganti kalau mau folder lain)
const TARGET_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(TARGET_DIR)) fs.mkdirSync(TARGET_DIR);

// --- API MONITORING ---
app.get('/api/stats', async (req, res) => {
    try {
        const [cpu, cpuSpeed, temp, mem, battery, fsSize, time] = await Promise.all([
            si.cpu(), 
            si.cpuCurrentSpeed(), 
            si.cpuTemperature(), 
            si.mem(), 
            si.battery(), 
            si.fsSize(), 
            si.time()
        ]);
        
        const h = Math.floor(time.uptime / 3600);
        const m = Math.floor((time.uptime % 3600) / 60);
        
        // Proteksi jika fsSize kosong
        const mainDisk = fsSize[0] || { used: 0, size: 0 };

        res.json({
            cpuModel: cpu.brand,
            cores: cpu.cores,
            clockSpeed: cpuSpeed.avg,
            temp: temp.main || '--',
            ramUsed: (mem.active / 1024 / 1024 / 1024).toFixed(1),
            ramTotal: (mem.total / 1024 / 1024 / 1024).toFixed(1),
            ramPercent: (mem.active / mem.total * 100).toFixed(1),
            diskUsed: (mainDisk.used / 1024 / 1024 / 1024).toFixed(1),
            diskTotal: (mainDisk.size / 1024 / 1024 / 1024).toFixed(1),
            batPercent: battery.percent || 0,
            batWatt: (battery.currentCapacity > 100 ? (battery.currentCapacity / 1000) : (battery.currentCapacity || 0)).toFixed(1),
            uptime: `${h}h ${m}m`
        });
    } catch (e) { 
        res.status(500).json({ error: e.message }); 
    }
});

// --- API FILE MANAGER ---

// List File
app.get('/api/files', (req, res) => {
    fs.readdir(TARGET_DIR, (err, files) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const fileList = files.map(name => {
            const stats = fs.statSync(path.join(TARGET_DIR, name));
            return {
                name: name,
                size: (stats.size / 1024).toFixed(1) + ' KB',
                isDir: stats.isDirectory()
            };
        });
        res.json(fileList);
    });
});

// Delete File
app.get('/api/delete/:name', (req, res) => {
    const fileName = req.params.name;
    const filePath = path.join(TARGET_DIR, fileName);

    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
            res.json({ success: true, message: `File ${fileName} berhasil dihapus` });
        } catch (e) {
            res.status(500).json({ error: "Gagal menghapus file" });
        }
    } else {
        res.status(404).json({ error: "File tidak ditemukan" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`  API Server Dashboard & File Manager    `);
    console.log(`  Running on: http://localhost:${PORT}   `);
    console.log(`  Target Dir: ${TARGET_DIR}              `);
    console.log(`=========================================`);
});
