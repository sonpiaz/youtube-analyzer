export default function VideoTable({ videos }) {
  // Hàm định dạng số
  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left border-b">Tiêu đề</th>
            <th className="py-3 px-4 text-right border-b">Lượt xem</th>
            <th className="py-3 px-4 text-right border-b">Lượt thích</th>
            <th className="py-3 px-4 text-right border-b">Bình luận</th>
            <th className="py-3 px-4 text-right border-b">Chỉ số tương tác (%)</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr key={video.id} className="hover:bg-gray-50">
              <td className="py-3 px-4 border-b">
                <a 
                  href={`https://www.youtube.com/watch?v=${video.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start space-x-3 hover:text-blue-600"
                >
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-24 h-auto rounded hidden sm:block" 
                  />
                  <div>
                    <p>{video.title}</p>
                    <p className="text-sm text-gray-500">{video.channelTitle}</p>
                  </div>
                </a>
              </td>
              <td className="py-3 px-4 text-right border-b">
                {formatNumber(video.statistics.views)}
              </td>
              <td className="py-3 px-4 text-right border-b">
                {formatNumber(video.statistics.likes)}
              </td>
              <td className="py-3 px-4 text-right border-b">
                {formatNumber(video.statistics.comments)}
              </td>
              <td className="py-3 px-4 text-right border-b">
                <span className={`
                  ${video.engagementScore > 5 ? 'text-green-600' : ''}
                  ${video.engagementScore > 10 ? 'font-bold' : ''}
                `}>
                  {video.engagementScore}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}