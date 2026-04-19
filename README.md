# 💜 IyuszTempest Dashboard Monitoring Server

Project ini adalah alternatif lain untuk memantau server dari jauh menggunakan website

![Preview](https://www.image2url.com/r2/default/files/1776590379448-349783d7-be0d-468e-863e-1d9c49c78787.png)

## 🛠️ Stack yang Digunakan
- **OS:** antiX Linux (Lightweight Debian-based)
- **Runtime:** Node.js & PM2 (Process Manager)
- **Tunnel:** Cloudflare Tunnel (cloudflared)
- **UI:** Tailwind CSS & Glassmorphism design
  
## 🚀 Fitur Utama
1. **Custom Dashboard**: Monitoring suhu CPU, RAM, Baterai, dan Storage secara real-time dengan tema iOS-style.

## 📦 Cara Setup (Overview)
Instalasi dashboard dashboard kustom:
```bash
cd dashboard
npm install express systeminformation
pm2 start app.js --name dashboard
```


Dibuat oleh Natalius (IyuszTempest) sebagai bagian dari eksplorasi sistem informasi dan manajemen server.
