import { useState } from 'react';

export default function SearchForm({ onSearch }) {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Nhập từ khóa tìm kiếm (ví dụ: Affiliate Marketing)"
          className="flex-grow p-3 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded"
        >
          Tìm kiếm
        </button>
      </div>
    </form>
  );
}