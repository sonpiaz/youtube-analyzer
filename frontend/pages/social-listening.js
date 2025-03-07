import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import SocialFeed from '../components/SocialFeed';

export default function SocialListening() {
  const [keyword, setKeyword] = useState('');
  const [videoId, setVideoId] = useState('');
  const [searchedKeyword, setSearchedKeyword] = useState('');
  const [searchedVideoId, setSearchedVideoId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Trích xuất videoId từ URL YouTube nếu có
    let extractedVideoId = videoId;
    if (videoId && videoId.includes('youtube.com/watch?v=')) {
      const url = new URL(videoId);
      extractedVideoId = url.searchParams.get('v');
    } else if (videoId && videoId.includes('youtu.be/')) {
      extractedVideoId = videoId.split('youtu.be/')[1];
      // Xóa các tham số truy vấn nếu có
      if (extractedVideoId.includes('?')) {
        extractedVideoId = extractedVideoId.split('?')[0];
      }
    }
    
    if (keyword.trim()) {
      setSearchedKeyword(keyword.trim());
      setSearchedVideoId(extractedVideoId);
    }
  };

  // Trích xuất ID video từ URL YouTube
  const extractVideoId = (url) => {
    try {
      if (url.includes('youtube.com/watch?v=')) {
        const urlObj = new URL(url);
        return urlObj.searchParams.get('v');
      } else if (url.includes('youtu.be/')) {
        let id = url.split('youtu.be/')[1];
        if (id.includes('?')) {
          id = id.split('?')[0];
        }
        return id;
      }
      return url; // Nếu đã là ID
    } catch (e) {
      return url; // Trả về nguyên giá trị nếu có lỗi
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Social Listening - YouTube Analyzer</title>
        <meta name="description" content="Phân tích dữ liệu mạng xã hội về một từ khóa" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Social Listening</h1>
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            ← Quay lại trang chủ
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Thu thập dữ liệu từ mạng xã hội</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
                  Từ khóa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Nhập từ khóa (ví dụ: Affiliate Marketing)"
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="videoId" className="block text-sm font-medium text-gray-700 mb-1">
                  URL Video YouTube (tùy chọn)
                </label>
                <input
                  type="text"
                  id="videoId"
                  value={videoId}
                  onChange={(e) => setVideoId(e.target.value)}
                  placeholder="Nhập URL video YouTube để phân tích bình luận"
                  className="w-full p-3 border border-gray-300 rounded"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Ví dụ: https://www.youtube.com/watch?v=dQw4w9WgXcQ
                </p>
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded"
                >
                  Bắt đầu thu thập dữ liệu
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Social Feed */}
        {searchedKeyword && (
          <SocialFeed 
            keyword={searchedKeyword} 
            videoId={searchedVideoId} 
          />
        )}

        {/* Giải thích tính năng */}
        {!searchedKeyword && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">Giới thiệu tính năng Social Listening</h3>
            <p className="text-blue-700 mb-2">
              Social Listening giúp bạn theo dõi những gì mọi người đang nói về từ khóa của bạn trên 
              các nền tảng mạng xã hội khác nhau.
            </p>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>Thu thập tweets mới nhất từ Twitter/X</li>
              <li>Thu thập bài đăng từ Reddit</li>
              <li>Phân tích bình luận trên YouTube (nếu bạn cung cấp URL video)</li>
            </ul>
            <p className="text-blue-700 mt-2">
              Điền thông tin và nhấn "Bắt đầu thu thập dữ liệu" để xem kết quả!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}