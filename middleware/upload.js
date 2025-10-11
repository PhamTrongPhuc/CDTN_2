const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 🔹 Tạo thư mục "uploads" nếu chưa tồn tại
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 🔹 Cấu hình nơi lưu ảnh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads')); // Lưu trong /public/uploads
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Tên file duy nhất
    },
});
// Giới hạn dung lượng và lọc định dạng ảnh
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // ✅ giới hạn 10MB
    fileFilter: function (req, file, cb) {
        const allowed = ['.jpg', '.jpeg', '.png', '.gif'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowed.includes(ext)) {
            return cb(new Error('❌ Chỉ chấp nhận file ảnh JPG, PNG hoặc GIF!'));
        }
        cb(null, true);
    },
});
// ✅ Middleware xử lý lỗi file quá lớn
const uploadErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Ảnh vượt quá kích thước cho phép (10MB)!' });
    } else if (err) {
        return res.status(400).json({ message: err.message || 'Lỗi upload file!' });
    }
    next();
};

// 🔹 Lọc chỉ cho phép file ảnh
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('❌ Chỉ được upload file ảnh (jpg, png, jpeg,...)'), false);
    }
    cb(null, true);
};

// 🔹 Giới hạn kích thước ảnh (tối đa 5MB)
const limits = { fileSize: 5 * 1024 * 1024 };



module.exports = { upload, uploadErrorHandler };
