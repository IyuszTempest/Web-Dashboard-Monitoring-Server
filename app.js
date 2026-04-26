const express = require('express');
const si = require('systeminformation');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer'); // Buat upload

const app = express();
app.use(cors());
app.use(express.json());

// Set folder root yang mau diakses (misal home user)
const ROOT_DIR = '/home/yus/api-server/uploads'; 
if (!fs.existsSync(ROOT_DIR)) fs.mkdirSync(ROOT_DIR, { recursive: true });

// Konfigurasi Simpan File
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, ROOT_DIR),
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// API: List Files
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

// API: Upload
app.post('/api/upload', upload.single('file'), (req, res) => {
    res.json({ success: true });
});

// API: Delete
app.delete('/api/delete/:name', (req, res) => {
    try {
        fs.unlinkSync(path.join(ROOT_DIR, req.params.name));
        res.json({ success: true });
    } catch (e) { res.json({ error: e.message }); }
});

// API: Download
app.get('/api/download/:name', (req, res) => {
    res.download(path.join(ROOT_DIR, req.params.name));
});

app.listen(3000, () => console.log('API File Manager Gacor di Port 3000'));
