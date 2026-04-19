const express = require('express');
const si = require('systeminformation');
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    try {
        const cpu = await si.cpu();
        const temp = await si.cpuTemperature();
        const mem = await si.mem();
        const os = await si.osInfo();
        const diskRaw = await si.fsSize();
        const graphics = await si.graphics();
        const battery = await si.battery();
        const uptime = si.time().uptime;

        const mainDisk = diskRaw.find(d => d.mount === '/') || diskRaw[0];
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);

        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <title>Your Dashboard</title>
            <style>
                body {
                    background: url('https://www.image2url.com/r2/default/files/1776589728732-b3b0f985-34e5-4c21-914b-792142815c53.jpg') no-repeat center center fixed;
                    background-size: cover;
                    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
                }
                .glass {
                    background: rgba(0, 0, 0, 0.45);
                    backdrop-filter: blur(25px) saturate(180%);
                    -webkit-backdrop-filter: blur(25px) saturate(180%);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
                .widget {
                    transition: transform 0.3s ease;
                }
                .widget:hover {
                    transform: scale(1.02);
                }
            </style>
        </head>
        <body class="min-h-screen p-6 md:p-12 text-white">
            
            <div class="max-w-6xl mx-auto mb-10 flex justify-between items-end px-4">
                <div>
                    <h1 class="text-4xl md:text-5xl font-black italic tracking-tighter text-white">
                        <span class="text-purple-500">Your</span> Server
                    </h1>
                    <p class="text-sm font-bold opacity-70 tracking-widest mt-2">${os.distro}</p>
                </div>
                <div class="text-right">
                    <p class="text-xs font-black opacity-50 uppercase mb-1 text-white">System Uptime</p>
                    <p class="text-2xl font-black text-white">${hours}h ${minutes}m</p>
                </div>
            </div>

            <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                
                <div class="glass widget rounded-[35px] p-6 col-span-2 md:col-span-1 border-l-4 border-orange-500">
                    <p class="text-[10px] font-black opacity-50 uppercase tracking-widest mb-4">Temperature</p>
                    <div class="flex items-end gap-2">
                        <span class="text-5xl font-black">${temp.main || '--'}</span>
                        <span class="text-2xl font-bold text-orange-500 mb-1">°C</span>
                    </div>
                    <p class="text-xs mt-4 font-bold opacity-60 truncate">${cpu.brand}</p>
                </div>

                <div class="glass widget rounded-[35px] p-6 border-l-4 border-cyan-400">
                    <p class="text-[10px] font-black opacity-50 uppercase tracking-widest mb-4">RAM</p>
                    <h2 class="text-3xl font-black text-white">${(mem.active / 1024 / 1024 / 1024).toFixed(1)} <span class="text-sm opacity-50">GB</span></h2>
                    <div class="w-full bg-white/10 h-1.5 rounded-full mt-6 overflow-hidden">
                        <div class="bg-cyan-400 h-full rounded-full" style="width: ${(mem.active/mem.total*100)}%"></div>
                    </div>
                </div>

                <div class="glass widget rounded-[35px] p-6 border-l-4 border-green-400">
                    <p class="text-[10px] font-black opacity-50 uppercase tracking-widest mb-4">Battery</p>
                    <h2 class="text-3xl font-black text-white">${battery.percent}%</h2>
                    <p class="text-[10px] mt-4 font-bold ${battery.isCharging ? 'text-green-400' : 'text-yellow-400'} uppercase">
                        ${battery.isCharging ? 'Charging' : 'On Battery'}
                    </p>
                </div>

                <div class="glass widget rounded-[35px] p-6 border-l-4 border-purple-500">
                    <p class="text-[10px] font-black opacity-50 uppercase tracking-widest mb-4">Storage ( / )</p>
                    <h2 class="text-3xl font-black text-white">${(mainDisk.used / 1024 / 1024 / 1024).toFixed(2)} <span class="text-sm opacity-50">GB</span></h2>
                    <p class="text-[10px] mt-4 font-bold opacity-60 italic">Free: ${(mainDisk.available / 1024 / 1024 / 1024).toFixed(1)}GB</p>
                </div>

                <div class="glass widget rounded-[40px] p-8 col-span-2 md:col-span-3 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div class="text-center md:text-left">
                        <p class="text-[10px] font-black opacity-40 uppercase tracking-widest mb-2">Graphics Processor</p>
                        <p class="text-xl font-bold text-emerald-400">${graphics.controllers[0].model}</p>
                    </div>
                    <div class="hidden md:block w-px h-12 bg-white/10"></div>
                    <div class="text-center md:text-right">
                        <p class="text-[10px] font-black opacity-40 uppercase tracking-widest mb-2">Kernel Version</p>
                        <p class="text-lg font-mono font-bold text-slate-300">${os.release}</p>
                    </div>
                </div>

                <button onclick="location.reload()" class="glass widget rounded-[40px] p-8 col-span-2 md:col-span-1 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all group">
                    <span class="text-lg font-black uppercase tracking-widest group-hover:text-cyan-400 transition-colors">Refresh!</span>
                </button>

            </div>
            
            <p class="text-center mt-10 text-[10px] font-bold opacity-30 uppercase tracking-[0.5em]">Your Private Server</p>

        </body>
        </html>
        `);
    } catch (e) {
        res.status(500).send("Error: " + e.message);
    }
});

app.listen(port, () => console.log('iOS Modular Dashboard Live!'));
