const express = require('express');
const si = require('systeminformation');
const cors = require('cors'); // WAJIB: biar bisa diakses dari domain Vercel
const app = express();

app.use(cors()); // Izinkan akses dari luar

app.get('/api/stats', async (req, res) => {
    try {
        const [cpuSpeed, temp, mem, battery, network, os, cpu, time] = await Promise.all([
            si.cpuCurrentSpeed(), si.cpuTemperature(), si.mem(), 
            si.battery(), si.networkStats(), si.osInfo(), si.cpu(), si.time()
        ]);
        
        const net = network[0] || { rx_sec: 0, tx_sec: 0 };
        const h = Math.floor(time.uptime / 3600);
        const m = Math.floor((time.uptime % 3600) / 60);

        res.json({
            distro: os.distro,
            cpuBrand: cpu.brand,
            uptime: `${h}h ${m}m`,
            temp: temp.main || '--',
            cpuSpeed: cpuSpeed.avg || '--',
            ramUsed: (mem.active / 1024 / 1024 / 1024).toFixed(1),
            ramPercent: (mem.active / mem.total * 100),
            batPercent: battery.percent || 0,
            batWatt: (battery.currentCapacity > 100 ? (battery.currentCapacity / 1000) : (battery.currentCapacity || 0)).toFixed(1),
            down: (net.rx_sec * 8 / (1024 * 1024)).toFixed(2),
            up: (net.tx_sec * 8 / (1024 * 1024)).toFixed(2)
        });
    } catch (e) { res.json({ error: e.message }); }
});

app.listen(3000, () => console.log('API Server is running on port 3000'));
