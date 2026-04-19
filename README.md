# 💜 IyuszTempest Private Server Infrastructure

Project ini adalah setup infrastruktur server pribadi yang berjalan di perangkat lama (antiX Linux) menggunakan **Cloudflare Tunnel** untuk akses publik tanpa port-forwarding.

![Preview](https://www.image2url.com/r2/default/files/1776590379448-349783d7-be0d-468e-863e-1d9c49c78787.png)

## 🛠️ Stack yang Digunakan
- **OS:** antiX Linux (Lightweight Debian-based)
- **Runtime:** Node.js & PM2 (Process Manager)
- **Tunnel:** Cloudflare Tunnel (cloudflared)
- **UI:** Tailwind CSS & Glassmorphism design
- **Tools:** FileBrowser (Remote File Management)

## 🚀 Fitur Utama
1. **Custom Dashboard**: Monitoring suhu CPU, RAM, Baterai, dan Storage secara real-time dengan tema iOS-style.
2. **Secure Remote Access**: Akses aman via HTTPS melalui subdomain Cloudflare tanpa mengekspos IP publik rumah.
3. **Web-Based File Manager**: Manajemen file bot WhatsApp dan database langsung dari browser HP/Laptop dari mana saja.

## 📦 Cara Setup (Overview)

### 1. Dashboard Monitoring
Instalasi dashboard dashboard kustom:
```bash
cd dashboard
npm install express systeminformation
pm2 start app.js --name dashboard
```

### 2. Cloudflare Tunnel Configuration
Konfigurasi Ingress Rules untuk multi-subdomain (yaml):
```YAML
ingress:
  - hostname: server.jmk48.com
    service: http://localhost:3000
  - hostname: files.dokslijomok.com
    service: http://localhost:8080
```
    
### 3. File Manager
Menjalankan FileBrowser di background:
```Bash
pm2 start "filebrowser -r /root -p 8080 -d /root/filebrowser.db" --name file-manager
```

Dibuat oleh Natalius (IyuszTempest) sebagai bagian dari eksplorasi sistem informasi dan manajemen server.
