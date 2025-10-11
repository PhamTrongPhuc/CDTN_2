require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// ====== Middleware ======
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====== Static Files ======
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// ====== Kết nối MongoDB ======
(async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('✅ MongoDB connected successfully!');
    } catch (err) {
        console.error('❌ MongoDB connection failed!');
        console.error(err.message);
        process.exit(1); // thoát tiến trình để tránh lỗi treo
    }
})();

// ====== Routes ======
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));

// ====== Trang chủ ======
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('⚠️ Không tìm thấy file index.html trong thư mục public!');
            res.status(404).send('<h1>Không tìm thấy trang chủ (index.html)!</h1>');
        }
    });
});

// ====== Server Start ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});
