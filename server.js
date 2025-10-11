require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // ✅ Bổ sung dòng này
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

const app = express();

// ====== Middleware ======
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/comments', require('./routes/comments'));

// ====== Kết nối MongoDB ======
(async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('✅ MongoDB connected successfully!');
    } catch (err) {
        console.error('❌ MongoDB connection failed!');
        console.error(err.message);
        process.exit(1);
    }
})();

// ====== Static Files ======
// 🔹 Phục vụ file tĩnh (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// 🔹 Cho phép truy cập ảnh upload
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// ====== Routes API ======
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

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
