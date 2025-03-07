import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import SearchForm from '../components/SearchForm';
import VideoTable from '../components/VideoTable';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');

  const searchVideos = async (searchKeyword) => {
    setLoading(true);
    setError(null);
    setKeyword(searchKeyword);
    
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/search`, {
        params: { keyword: searchKeyword }
      });
      setVideos(response.data);
    } catch (err) {
      console.error('Lỗi khi tìm kiếm:', err);
      setError('Đã xảy ra lỗi khi tìm kiếm video. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Phân tích Video YouTube</title>
        <meta name="description" content="Ứng dụng phân tích video YouTube" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Phân tích Video YouTube
          </h1>
          <Link 
            href="/social-listening" 
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded"
          >
            Social Listening
          </Link>
        </div>
        
        <SearchForm onSearch={searchVideos} />
        
        {loading && (
          <div className="text-center py-10">
            <p className="text-lg">Đang tìm kiếm...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4 mb-4">
            {error}
          </div>
        )}
        
        {!loading && videos.length > 0 && (
          <>
            <VideoTable videos={videos} />
            
            {/* Social Listening CTA */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h2 className="text-lg font-medium text-blue-800 mb-2">
                Muốn biết thêm về từ khóa "{keyword}"?
              </h2>
              <p className="text-blue-700 mb-3">
                Khám phá những gì mọi người đang nói về chủ đề này trên các nền tảng mạng xã hội.
              </p>
              <Link 
                href={`/social-listening?keyword=${encodeURIComponent(keyword)}`}
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Phân tích Social Listening
              </Link>
            </div>
          </>
        )}
        
        {!loading && !error && videos.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            Nhập từ khóa và nhấn "Tìm kiếm" để bắt đầu.
          </p>
        )}
      </main>
    </div>
  );
}