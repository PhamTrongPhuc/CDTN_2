const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const { auth } = require('../middleware/auth');
const { upload, uploadErrorHandler } = require('../middleware/upload');



// Route lấy danh sách bài viết
router.get('/', postController.getAllPosts);
// Tạo bài viết mới có upload ảnh
router.post('/', auth, upload.single('image'), uploadErrorHandler, postController.createPost);
// Route lấy danh sách bài viết
router.get('/', postController.getAllPosts);
// Lấy bài viết theo ID
router.get('/:id', postController.getPostById);

// Tạo bài viết (có thể có ảnh)
router.post('/', auth, upload.single('image'), uploadErrorHandler, postController.createPost);

// Cập nhật bài viết (cho phép thay ảnh)
router.put('/:id', auth, upload.single('image'), postController.updatePost);

// 🔹Xóa bài viết
router.delete('/:id', auth, postController.deletePost);

router.post('/:id/react', auth, postController.reactPost);

module.exports = router;
