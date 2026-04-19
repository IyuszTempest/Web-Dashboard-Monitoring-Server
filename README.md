# 💜 IyuszTempest Server Dashboard

Dashboard monitoring server berbasis web dengan tampilan **iOS Modular Style**. Didesain khusus untuk server ringan (seperti antiX/Debian) agar tetap estetik, responsif, dan fungsional.

![Preview](https://www.image2url.com/r2/default/files/1776590379448-349783d7-be0d-468e-863e-1d9c49c78787.png)

## ✨ Fitur Utama
- 📱 **iOS Widget Layout**: Tampilan modular yang rapi di desktop maupun mobile.
- 🌫️ **Glassmorphism UI**: Efek kaca blur yang modern dengan dukungan Tailwind CSS.
- 📊 **Real-time Monitoring**:
    - Suhu CPU (Celsius).
    - Penggunaan RAM (GB).
    - Status Baterai (Persentase & Charging).
    - Kapasitas Penyimpanan (Root disk `/`).
- 🛠️ **System Info**: Detail GPU, Versi Kernel, dan Hostname.

## 🚀 Cara Install

### 1. Persyaratan
Pastikan Anda sudah menginstall **Node.js** dan **npm** di server Anda.

### 2. Clone Repository
```bash
git clone [https://github.com/username-lo/iyusztempest-dashboard.git](https://github.com/username-lo/iyusztempest-dashboard.git)
cd iyusztempest-dashboard
```

### 3. Install Dependensi
```Bash
npm install express systeminformation
```

### 4. Jalankan Dashboard
```Bash
node app.js
Atau jika menggunakan PM2 agar berjalan di background:
```

```Bash
pm2 start app.js --name iyusz-dashboard
```

## 🌐 Akses Dashboard
Buka browser dan akses melalui IP lokal atau domain Anda:
http://localhost:3000 atau https://domain-lo.com

## ⚙️ Kustomisasi
Background: Ubah URL gambar pada bagian body { background: url('...') } di dalam file app.js.

Warna Aksen: Cari class text-purple-500 atau text-cyan-400 dan ubah sesuai selera Anda.
