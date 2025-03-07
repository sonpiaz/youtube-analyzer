const express = require('express');
const router = express.Router();
const socialListener = require('../services/social-listener');

/**
 * @route   GET /api/social/comments/:videoId
 * @desc    Thu thập bình luận của một video YouTube
 * @access  Public
 */
router.get('/comments/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    
    if (!videoId) {
      return res.status(400).json({ error: 'Video ID là bắt buộc' });
    }
    
    const comments = await socialListener.getYouTubeComments(videoId);
    
    res.json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    console.error('Lỗi khi thu thập bình luận:', error);
    res.status(500).json({ 
      error: 'Đã xảy ra lỗi khi thu thập bình luận',
      details: error.message 
    });
  }
});

/**
 * @route   GET /api/social/twitter/:keyword
 * @desc    Thu thập bài đăng Twitter về một từ khóa
 * @access  Public
 */
router.get('/twitter/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;
    
    if (!keyword) {
      return res.status(400).json({ error: 'Từ khóa là bắt buộc' });
    }
    
    const tweets = await socialListener.getTwitterPosts(keyword);
    
    res.json({
      success: true,
      count: tweets.length,
      data: tweets
    });
  } catch (error) {
    console.error('Lỗi khi thu thập dữ liệu Twitter:', error);
    res.status(500).json({ 
      error: 'Đã xảy ra lỗi khi thu thập dữ liệu Twitter',
      details: error.message 
    });
  }
});

/**
 * @route   GET /api/social/reddit/:keyword
 * @desc    Thu thập bài đăng Reddit về một từ khóa
 * @access  Public
 */
router.get('/reddit/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;
    
    if (!keyword) {
      return res.status(400).json({ error: 'Từ khóa là bắt buộc' });
    }
    
    const posts = await socialListener.getRedditPosts(keyword);
    
    res.json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    console.error('Lỗi khi thu thập dữ liệu Reddit:', error);
    res.status(500).json({ 
      error: 'Đã xảy ra lỗi khi thu thập dữ liệu Reddit',
      details: error.message 
    });
  }
});

/**
 * @route   GET /api/social/analyze
 * @desc    Phân tích tất cả các nền tảng về một từ khóa
 * @access  Public
 */
router.get('/analyze', async (req, res) => {
  try {
    const { keyword, videoId } = req.query;
    
    if (!keyword) {
      return res.status(400).json({ error: 'Từ khóa là bắt buộc' });
    }
    
    const socialData = await socialListener.getSocialData(keyword, videoId);
    
    res.json({
      success: true,
      data: socialData
    });
  } catch (error) {
    console.error('Lỗi khi phân tích dữ liệu social:', error);
    res.status(500).json({ 
      error: 'Đã xảy ra lỗi khi phân tích dữ liệu social',
      details: error.message 
    });
  }
});

module.exports = router;