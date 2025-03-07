require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');

// Import routes
const searchRoutes = require('./routes/search');
const socialRoutes = require('./routes/social');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Cấu hình YouTube API
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

// API routes
app.use('/api/search', searchRoutes);
app.use('/api/social', socialRoutes);

// Route mặc định
app.get('/', (req, res) => {
  res.json({
    message: 'YouTube Analyzer API - Kết nối thành công',
    version: '1.0.0',
    endpoints: {
      search: '/api/search?keyword=your_keyword',
      socialAnalyze: '/api/social/analyze?keyword=your_keyword&videoId=optional_video_id',
      youtubeComments: '/api/social/comments/:videoId',
      twitterPosts: '/api/social/twitter/:keyword',
      redditPosts: '/api/social/reddit/:keyword'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});