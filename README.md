Markdown
# 💜 IyuszTempest Dashboard Monitoring Server

![image](https://www.image2url.com/r2/default/images/1777204938940-5756cdbf-76bb-4e25-b834-11124faa4ebc.jpeg)

Dashboard monitoring server minimalis dengan gaya **Glassmorphism Cyberpunk**. Dibuat khusus untuk memantau spesifikasi laptop server (antiX Linux) secara real-time dari jarak jauh menggunakan Cloudflare Tunnel.

## 🚀 Fitur Utama
- **Real-time Monitoring**: Suhu CPU, Clock Speed, RAM, Disk, hingga Power Draw.
- **Network & IO Stats**: Pantau kecepatan download/upload dan kecepatan baca/tulis storage (MB/s).
- **Server Health**: Indikator kesehatan baterai dan status OS.
- **Advanced File Manager**: 
    - Upload & Download file.
    - Create Folder & Rename file.
    - **Zip & Extract**: Kompres file atau ekstrak arsip `.zip` langsung dari browser.
- **Cyberpunk UI**: Desain futuristik dengan *live dot indicators* dan animasi halus.

## 🛠️ Tech Stack
- **Frontend**: HTML5, Tailwind CSS, Lucide Icons, JavaScript (Vanilla).
- **Backend**: Node.js, Express.
- **Libraries**: `systeminformation`, `fs-extra`, `adm-zip`, `multer`, `cors`.
- **Tunneling**: Cloudflare Tunnel (`cloudflared`).
- **Process Manager**: PM2.

## ⚙️ Cara Instalasi (Local Server)

1. **Clone Repository**
   ```bash
   git clone [https://github.com/IyuszTempest/Web-Dashboard-Monitoring-Server.git](https://github.com/IyuszTempest/Web-Dashboard-Monitoring-Server.git)
   cd Web-Dashboard-Monitoring-Server
   ```

2. **Install Dependencies**
```Bash
npm install
```

3. **Menjalankan Server**
```Bash
pm2 start app.js --name dashboard-api
```

4. **Konfigurasi Cloudflare Tunnel**
```Bash
pm2 start "cloudflared tunnel run --url http://localhost:3000 your-tunnel-name" --name cf-tunnel
```

## 📂 Struktur Project
- **index.html** : Halaman dashboard utama (Stats).
- **files.html** : Halaman pengelolaan file (File Manager).
- **app.js**     : Backend API server untuk data sistem dan operasi file.
- **uploads/**   : Folder penyimpanan file (Root directory file manager).
