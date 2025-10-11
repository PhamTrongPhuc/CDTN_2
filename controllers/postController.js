const path = require('path');
const fs = require('fs');
const Post = require('../models/Posts');

// Tạo bài viết mới
exports.createPost = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        const newPost = new Post({
            title,
            content,
            image,
            category,
            author: req.user?.id
        });

        const savedPost = await newPost.save();
        res.status(201).json({ message: '✅ Đăng bài thành công!', post: savedPost });
    } catch (error) {
        if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: '❌ Ảnh vượt quá kích thước cho phép (5MB).' });
        }
        console.error('❌ Lỗi khi tạo bài viết:', error);
        res.status(500).json({ message: '❌ Lỗi server!', error: error.message });
    }
};
// Lấy tất cả bài viết
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username fullName')
            .populate('category', 'name')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//Xử lý logic tạo bài viết kèm ảnh.
exports.createPost = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        const newPost = new Post({
            title,
            content,
            image,
            category,
            author: req.user?.id
        });

        const savedPost = await newPost.save();
        res.status(201).json({ message: '✅ Đăng bài thành công!', post: savedPost });
    } catch (error) {
        console.error('❌ Lỗi khi tạo bài viết:', error);
        res.status(500).json({ message: 'Lỗi server khi tạo bài viết' });
    }
};
exports.getPosts = async (req, res) => {
    const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
    res.json(posts);
};

// Lấy bài viết theo ID
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username fullName')
            .populate('category', 'name');

        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Cập nhật bài viết
exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Kiểm tra quyền
        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No permission' });
        }

        const { title, content, category } = req.body;
        if (title) post.title = title;
        if (content) post.content = content;
        if (category) post.category = category;

        // Nếu có upload ảnh mới
        if (req.file) {
            // Xóa ảnh cũ nếu có
            if (post.image) {
                const oldImagePath = path.join(__dirname, '..', post.image);
                if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
            }
            post.image = `/uploads/${req.file.filename}`;
        }

        post.updatedAt = Date.now();
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Xóa bài viết
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Kiểm tra quyền
        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No permission' });
        }

        // Xóa ảnh trong thư mục uploads (nếu có)
        if (post.image) {
            const oldImagePath = path.join(__dirname, '..', post.image);
            if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }

        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// 🟢 Lấy danh sách tất cả bài viết
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username');
        res.json(posts);
    } catch (error) {
        console.error('❌ Lỗi khi lấy danh sách bài viết:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy bài viết' });
    }
};
// ❤️ Gửi biểu cảm cho bài viết
exports.reactPost = async (req, res) => {
    try {
        const { reaction } = req.body; // like | love | haha
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết!' });

        if (!post.reactions) {
            post.reactions = { like: 0, love: 0, haha: 0 };
        }

        // Cập nhật cảm xúc
        if (reaction === 'like') post.reactions.like += 1;
        else if (reaction === 'love') post.reactions.love += 1;
        else if (reaction === 'haha') post.reactions.haha += 1;
        else return res.status(400).json({ message: 'Loại cảm xúc không hợp lệ!' });

        await post.save();

        res.json({
            message: 'Cảm xúc đã được ghi nhận!',
            reactions: post.reactions
        });
    } catch (err) {
        console.error('Lỗi khi gửi cảm xúc:', err);
        res.status(500).json({ message: 'Lỗi server khi gửi cảm xúc!' });
    }
};