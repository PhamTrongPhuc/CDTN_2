const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // 🟢 Dùng để tạo token

// =========================
// 🟢 ĐĂNG KÝ
// =========================
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password)
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });

        const existing = await User.findOne({ $or: [{ username }, { email }] });
        if (existing)
            return res.status(400).json({ message: 'Tài khoản đã tồn tại' });

        const hashed = await bcrypt.hash(password, 10);
        await User.create({ username, email, password: hashed });
        res.status(201).json({ message: 'Đăng ký thành công!' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// =========================
// 🔐 ĐĂNG NHẬP
// =========================
exports.login = async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        // Tìm người dùng bằng username hoặc email
        const user = await User.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
        });
        if (!user)
            return res.status(400).json({ message: 'Tài khoản không tồn tại' });

        // So sánh mật khẩu
        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(400).json({ message: 'Sai mật khẩu' });

        // ✅ Tạo token kèm username & email
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                email: user.email
            },
            process.env.JWT_SECRET || 'mysecretkey',
            { expiresIn: '1d' }
        );

        // ✅ Gửi token về frontend
        res.json({
            message: 'Đăng nhập thành công!',
            token
        });

    } catch (err) {
        console.error('Lỗi khi đăng nhập:', err);
        res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
    }
};
