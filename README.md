# YouTube Analyzer với Social Listening

Ứng dụng phân tích video YouTube và thu thập dữ liệu từ mạng xã hội.

## Tính năng

### Phân tích YouTube
- Tìm kiếm video theo từ khóa
- Xếp hạng theo lượt xem, lượt thích, lượt bình luận
- Tính toán chỉ số tương tác

### Social Listening
- Thu thập bài đăng từ Twitter/X
- Thu thập bài đăng từ Reddit
- Thu thập bình luận từ video YouTube
- Phân tích xu hướng

## Cài đặt

### Yêu cầu
- Node.js (v16+)
- npm hoặc yarn

### Cài đặt Backend

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt thư viện
npm install

# Tạo file .env
cp .env.example .env

# Mở file .env và thêm YouTube API Key
```

### Cài đặt Frontend

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt thư viện
npm install

# Tạo file .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
```

## Chạy ứng dụng

### Chạy Backend

```bash
# Trong thư mục backend
npm run dev
```

### Chạy Frontend

```bash
# Trong thư mục frontend
npm run dev
```

Truy cập ứng dụng tại: http://localhost:3000

## Triển khai (Deploy)

### Triển khai Backend
- Dùng Render.com, Railway.app hoặc Heroku
- Set biến môi trường `YOUTUBE_API_KEY`

### Triển khai Frontend
- Dùng Vercel hoặc Render.com
- Set biến môi trường `NEXT_PUBLIC_API_URL` cho frontend

## Lưu ý khi triển khai Puppeteer

Puppeteer yêu cầu một số cấu hình đặc biệt khi triển khai:

### Render.com
Sử dụng buildpack sau: https://github.com/puppeteer/puppeteer/tree/main/packages/puppeteer-core

### Railway.app
Cần một số cấu hình bổ sung như:
```
NODE_OPTIONS=--max_old_space_size=4096
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```

## Giấy phép
ISC