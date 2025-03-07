const express = require('express');
const router = express.Router();
const { google } = require('googleapis');

// Cấu hình YouTube API
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

/**
 * @route   GET /api/search
 * @desc    Tìm kiếm video YouTube theo từ khóa
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { keyword } = req.query;
    
    if (!keyword) {
      return res.status(400).json({ error: 'Từ khóa tìm kiếm là bắt buộc' });
    }

    // Tìm kiếm video trên YouTube
    const searchResponse = await youtube.search.list({
      part: 'snippet',
      q: keyword,
      type: 'video',
      maxResults: 30,
      order: 'date'  // Sắp xếp theo ngày đăng mới nhất
    });

    const videoIds = searchResponse.data.items.map(item => item.id.videoId);
    
    // Lấy thông tin chi tiết về video (lượt xem, like, bình luận)
    const videosResponse = await youtube.videos.list({
      part: 'snippet,statistics',
      id: videoIds.join(',')
    });

    // Xử lý và định dạng dữ liệu
    const videos = videosResponse.data.items.map(video => {
      const statistics = video.statistics || {};
      
      // Tính toán chỉ số tương tác
      const views = parseInt(statistics.viewCount) || 0;
      const likes = parseInt(statistics.likeCount) || 0;
      const comments = parseInt(statistics.commentCount) || 0;
      
      // Tránh chia cho 0
      const engagementScore = views > 0 
        ? ((likes + comments) / views * 100).toFixed(2) 
        : 0;
        
      return {
        id: video.id,
        title: video.snippet.title,
        channelTitle: video.snippet.channelTitle,
        publishedAt: video.snippet.publishedAt,
        thumbnail: video.snippet.thumbnails.high.url,
        statistics: {
          views,
          likes,
          comments
        },
        engagementScore: parseFloat(engagementScore)
      };
    });

    // Sắp xếp video theo lượt xem (giảm dần)
    const sortedVideos = videos.sort((a, b) => 
      b.statistics.views - a.statistics.views
    );

    res.json(sortedVideos);
  } catch (error) {
    console.error('Lỗi khi tìm kiếm video:', error);
    res.status(500).json({ 
      error: 'Đã xảy ra lỗi khi tìm kiếm video', 
      details: error.message 
    });
  }
});

module.exports = router;