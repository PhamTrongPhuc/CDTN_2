const Comment = require('../models/Comment');

exports.getComments = async (req, res) => {
  const comments = await Comment.find();
  res.json(comments);
};

exports.createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const userId = req.user.id;

    const newComment = new Comment({ postId, userId, content });
    await newComment.save();

    res.status(201).json({ message: '💬 Bình luận thành công!', comment: newComment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi thêm bình luận' });
  }
};
// Xóa bình luận
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment)
      return res.status(404).json({ message: "Bình luận không tồn tại" });

    // Kiểm tra người dùng hiện tại có phải là tác giả không
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Bạn không có quyền xóa bình luận này" });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa bình luận thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi xóa bình luận" });
  }
};
exports.getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Không thể tải bình luận' });
  }
};
