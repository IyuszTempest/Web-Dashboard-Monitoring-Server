const express = require('express');
const si = require('systeminformation');
const app = express();
const port = 3000;

// API untuk data Real-time (Auto Refresh tiap 2 detik)
app.get('/api/stats', async (req, res) => {
    try {
        const [cpuSpeed, temp, mem, battery, network] = await Promise.all([
            si.cpuCurrentSpeed(),
            si.cpuTemperature(),
            si.mem(),
            si.battery(),
            si.networkStats()
        ]);

        const net = network[0] || { rx_sec: 0, tx_sec: 0 };
        
        res.json({
            temp: temp.main || '--',
            cpuSpeed: cpuSpeed.avg || '--',
            ramUsed: (mem.active / 1024 / 1024 / 1024).toFixed(1),
            ramPercent: (mem.active / mem.total * 100),
            batPercent: battery.percent || 0,
            // Jika Watt ribuan (mW), bagi 1000. Jika normal, tampilkan apa adanya.
            batWatt: (battery.currentCapacity > 100 ? (battery.currentCapacity / 1000) : (battery.currentCapacity || 0)).toFixed(1),
            batVolt: battery.voltage || '0',
            // Konversi ke Mbps yang akurat
            down: (net.rx_sec * 8 / (1024 * 1024)).toFixed(2),
            up: (net.tx_sec * 8 / (1024 * 1024)).toFixed(2)
        });
    } catch (e) {
        res.json({ error: e.message });
    }
});

// Route Utama Tampilan Dashboard
app.get('/', async (req, res) => {
    try {
        const os = await si.osInfo();
        const cpu = await si.cpu();
        const uptime = si.time().uptime;
        const h = Math.floor(uptime / 3600);
        const m = Math.floor((uptime % 3600) / 60);

        res.send(`
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <title>Your Server</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body {
            background: url('https://www.image2url.com/r2/default/files/1776589728732-b3b0f985-34e5-4c21-914b-792142815c53.jpg') no-repeat center center fixed;
            background-size: cover;
            font-family: 'Inter', sans-serif;
            color: white;
        }
        .glass { 
            background: rgba(0, 0, 0, 0.6); 
            backdrop-filter: blur(20px) saturate(160%); 
            border: 1px solid rgba(255, 255, 255, 0.1); 
        }
        .live-dot { animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
    </style>
</head>
<body class="min-h-screen p-6">
    
    <div class="max-w-6xl mx-auto mb-8 flex justify-between items-center px-4">
        <div>
            <h1 class="text-3xl font-black italic tracking-tighter text-purple-500">Your<span class="text-white">Server</span></h1>
            <p class="text-[10px] font-bold opacity-60 uppercase tracking-widest">${os.distro}</p>
        </div>
        <div class="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 glass">
            <div class="w-2 h-2 bg-green-500 rounded-full live-dot"></div>
            <span class="text-[10px] font-black uppercase tracking-widest">Active</span>
        </div>
    </div>

    <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div class="glass rounded-[30px] p-5 border-l-4 border-orange-500">
            <p class="text-[9px] font-black opacity-50 uppercase mb-3">Temperature</p>
            <div class="text-3xl font-black"><span id="temp">--</span>°C</div>
        </div>

        <div class="glass rounded-[30px] p-5 border-l-4 border-yellow-400">
            <p class="text-[9px] font-black opacity-50 uppercase mb-3">CPU Speed</p>
            <div class="text-3xl font-black"><span id="cpuSpeed">--</span><span class="text-xs ml-1">GHz</span></div>
        </div>

        <div class="glass rounded-[30px] p-5 border-l-4 border-cyan-400">
            <p class="text-[9px] font-black opacity-50 uppercase mb-3">RAM Usage</p>
            <div class="text-3xl font-black"><span id="ramUsed">--</span><span class="text-xs ml-1">GB</span></div>
            <div class="w-full bg-white/10 h-1 mt-3 rounded-full overflow-hidden">
                <div id="ramBar" class="bg-cyan-400 h-full transition-all duration-500" style="width: 0%"></div>
            </div>
        </div>

        <div class="glass rounded-[30px] p-5 border-l-4 border-pink-500">
            <p class="text-[9px] font-black opacity-50 uppercase mb-3">Power draw</p>
            <div class="text-3xl font-black"><span id="batWatt">--</span><span class="text-xs ml-1">W</span></div>
            <p class="text-[8px] mt-2 opacity-50 font-bold"><span id="batVolt">--</span>V Output</p>
        </div>

        <div class="glass rounded-[30px] p-5 border-l-4 border-blue-500">
            <p class="text-[9px] font-black opacity-50 uppercase mb-3">Download</p>
            <div class="text-2xl font-black text-blue-400">↓ <span id="down" class="text-white">--</span></div>
            <p class="text-[8px] opacity-40 uppercase mt-1 italic">Mbps Speed</p>
        </div>

        <div class="glass rounded-[30px] p-5 border-l-4 border-purple-500">
            <p class="text-[9px] font-black opacity-50 uppercase mb-3">Upload</p>
            <div class="text-2xl font-black text-purple-400">↑ <span id="up" class="text-white">--</span></div>
            <p class="text-[8px] opacity-40 uppercase mt-1 italic">Mbps Speed</p>
        </div>

        <div class="glass rounded-[40px] p-8 col-span-2 md:col-span-6 flex justify-between items-center px-10">
            <div class="hidden md:block text-xs font-bold opacity-40 uppercase tracking-[0.2em] italic">${cpu.brand}</div>
            <div class="text-center md:text-right">
                <p class="text-[9px] font-black opacity-40 uppercase">System Status</p>
                <div class="flex items-center gap-4">
                    <span class="text-2xl font-black text-green-400"><span id="batPercent">--</span>% Battery</span>
                    <span class="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full border border-white/10 italic">${h}h ${m}m Uptime</span>
                </div>
            </div>
        </div>
    </div>

    <script>
        async function updateStats() {
            try {
                const res = await fetch('/api/stats');
                const data = await res.json();
                document.getElementById('temp').innerText = data.temp;
                document.getElementById('cpuSpeed').innerText = data.cpuSpeed;
                document.getElementById('ramUsed').innerText = data.ramUsed;
                document.getElementById('ramBar').style.width = data.ramPercent + '%';
                document.getElementById('batPercent').innerText = data.batPercent;
                document.getElementById('batWatt').innerText = data.batWatt;
                document.getElementById('batVolt').innerText = data.batVolt;
                document.getElementById('down').innerText = data.down;
                document.getElementById('up').innerText = data.up;
            } catch (e) { console.log("Update Error"); }
        }
        setInterval(updateStats, 2000);
        updateStats();
    </script>
</body>
</html>
        `);
    } catch (e) {
        res.status(500).send("Error: " + e.message);
    }
});

app.listen(port, () => console.log('Your Server Live Dashboard is Active!'));
