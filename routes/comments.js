const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { auth } = require('../middleware/auth');

router.get('/', commentController.getComments);
router.post('/', auth, commentController.createComment);
router.delete('/:id', auth, commentController.deleteComment);
router.post('/', auth, commentController.createComment);
router.get('/:postId', commentController.getCommentsByPost);
module.exports = router;
