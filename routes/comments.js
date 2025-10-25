const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { auth } = require('../middleware/auth');

router.get('/', commentController.getComments);
router.post('/', auth, commentController.createComment);
router.delete('/:id', auth, commentController.deleteComment);
router.post('/', auth, commentController.createComment);
router.get('/:postId', commentController.getCommentsByPost);
// Lấy danh sách bình luận
router.get("/:postId", commentController.getComments);

// Tạo bình luận mới
router.post("/", auth, commentController.createComment);

// 🗑️ Xóa bình luận (chỉ tác giả được xóa)
router.delete("/:id", auth, commentController.deleteComment);

module.exports = router;
