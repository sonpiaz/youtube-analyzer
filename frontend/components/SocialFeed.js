import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SocialFeed({ keyword, videoId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socialData, setSocialData] = useState(null);
  const [activeTab, setActiveTab] = useState('twitter');

  useEffect(() => {
    if (!keyword) return;

    const fetchSocialData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/social/analyze`, {
          params: { keyword, videoId }
        });
        
        setSocialData(response.data.data);
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu social:', err);
        setError('Đã xảy ra lỗi khi thu thập dữ liệu từ mạng xã hội. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchSocialData();
  }, [keyword, videoId]);

  // Định dạng thời gian
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-lg">Đang thu thập dữ liệu từ mạng xã hội...</p>
        <p className="text-sm text-gray-500 mt-2">Quá trình này có thể mất 1-2 phút</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        {error}
      </div>
    );
  }

  if (!socialData) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-3 bg-gray-100 border-b">
        <h2 className="text-xl font-semibold">Social Listening: "{keyword}"</h2>
        <p className="text-sm text-gray-600">Thu thập dữ liệu: {formatDate(socialData.timestamp)}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 ${activeTab === 'twitter' ? 'bg-blue-50 border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('twitter')}
        >
          Twitter ({socialData.platforms.twitter?.count || 0})
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'reddit' ? 'bg-blue-50 border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('reddit')}
        >
          Reddit ({socialData.platforms.reddit?.count || 0})
        </button>
        {videoId && (
          <button
            className={`px-4 py-2 ${activeTab === 'youtube' ? 'bg-blue-50 border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('youtube')}
          >
            YouTube ({socialData.platforms.youtube?.count || 0})
          </button>
        )}
      </div>

      {/* Twitter Content */}
      {activeTab === 'twitter' && (
        <div className="p-4">
          <h3 className="text-lg font-medium mb-3">Tweets gần đây về "{keyword}"</h3>
          
          {socialData.platforms.twitter?.posts.length === 0 ? (
            <p className="text-gray-500">Không tìm thấy tweet nào về từ khóa này.</p>
          ) : (
            <div className="space-y-4">
              {socialData.platforms.twitter?.posts.map((tweet, index) => (
                <div key={index} className="border rounded-lg p-3 hover:bg-gray-50">
                  <div className="font-medium">{tweet.author}</div>
                  <p className="mt-1">{tweet.content}</p>
                  <div className="mt-2 text-sm text-gray-500 flex gap-3">
                    {Object.entries(tweet.interactions || {}).map(([key, value]) => (
                      <span key={key}>{key}: {value}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reddit Content */}
      {activeTab === 'reddit' && (
        <div className="p-4">
          <h3 className="text-lg font-medium mb-3">Bài đăng Reddit về "{keyword}"</h3>
          
          {socialData.platforms.reddit?.posts.length === 0 ? (
            <p className="text-gray-500">Không tìm thấy bài đăng Reddit nào về từ khóa này.</p>
          ) : (
            <div className="space-y-4">
              {socialData.platforms.reddit?.posts.map((post, index) => (
                <div key={index} className="border rounded-lg p-3 hover:bg-gray-50">
                  <a 
                    href={post.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium hover:text-blue-600"
                  >
                    {post.title}
                  </a>
                  <div className="mt-1 text-sm">
                    <span className="text-gray-600">Đăng bởi: {post.author}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 flex gap-3">
                    <span>Điểm: {post.score}</span>
                    <span>Bình luận: {post.commentCount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* YouTube Comments */}
      {activeTab === 'youtube' && videoId && (
        <div className="p-4">
          <h3 className="text-lg font-medium mb-3">Bình luận YouTube</h3>
          
          {!socialData.platforms.youtube || socialData.platforms.youtube.comments.length === 0 ? (
            <p className="text-gray-500">Không tìm thấy bình luận nào cho video này.</p>
          ) : (
            <div className="space-y-4">
              {socialData.platforms.youtube.comments.map((comment, index) => (
                <div key={index} className="border rounded-lg p-3 hover:bg-gray-50">
                  <div className="font-medium">{comment.author}</div>
                  <p className="mt-1">{comment.content}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <span>Thích: {comment.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}