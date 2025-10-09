const Comment = require('../models/Comment');

exports.getComments = async (req, res) => {
  const comments = await Comment.find();
  res.json(comments);
};

exports.createComment = async (req, res) => {
  const newComment = new Comment(req.body);
  await newComment.save();
  res.json(newComment);
};

exports.deleteComment = async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
