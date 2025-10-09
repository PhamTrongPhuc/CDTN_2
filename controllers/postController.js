const Post = require('../models/Posts');

exports.createPost = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const image = req.file ? req.file.path : null;
        const post = new Post({ author: req.user._id, title, content, category: category || null, image });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username fullName').populate('category', 'name').sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username fullName').populate('category', 'name');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') return res.status(403).json({ message: 'No permission' });

        const { title, content, category } = req.body;
        if (title) post.title = title;
        if (content) post.content = content;
        if (category) post.category = category;
        if (req.file) post.image = req.file.path;
        post.updatedAt = Date.now();
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') return res.status(403).json({ message: 'No permission' });
        await post.remove();
        res.json({ message: 'Post removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
