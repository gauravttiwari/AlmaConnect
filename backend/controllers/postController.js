const Post = require('../models/Post');

module.exports = {
  async createPost(req, res) {
    const { content } = req.body;
    const author = req.user.id; // Assume user is set in req.user
    const post = new Post({ author, content });
    await post.save();
    res.status(201).json(post);
  },
  async getFeed(req, res) {
    const posts = await Post.find().populate('author').populate('comments.user').sort({ createdAt: -1 });
    res.json(posts);
  },
  async likePost(req, res) {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!post.likes.includes(req.user.id)) post.likes.push(req.user.id);
    await post.save();
    res.json(post);
  },
  async commentPost(req, res) {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.comments.push({ user: req.user.id, text: req.body.text });
    await post.save();
    res.json(post);
  },
  async sharePost(req, res) {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!post.shares.includes(req.user.id)) post.shares.push(req.user.id);
    await post.save();
    res.json(post);
  }
};
