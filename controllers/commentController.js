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
exports.deleteComment = async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
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
