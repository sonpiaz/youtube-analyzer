const puppeteer = require('puppeteer');

/**
 * Module Social Listening sử dụng Puppeteer
 * Thu thập dữ liệu từ các nền tảng xã hội mà không cần API
 */
class SocialListener {
  constructor() {
    this.browser = null;
    this.initialized = false;
  }

  /**
   * Khởi tạo trình duyệt Puppeteer
   */
  async initialize() {
    if (!this.initialized) {
      this.browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      this.initialized = true;
    }
    return this.browser;
  }

  /**
   * Đóng trình duyệt khi không sử dụng
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      this.initialized = false;
    }
  }

  /**
   * Thu thập bình luận từ YouTube
   * @param {string} videoId - ID của video YouTube
   * @param {number} commentLimit - Số lượng bình luận tối đa cần thu thập
   */
  async getYouTubeComments(videoId, commentLimit = 50) {
    await this.initialize();
    
    const page = await this.browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    try {
      // Truy cập trang video
      await page.goto(`https://www.youtube.com/watch?v=${videoId}`, {
        waitUntil: 'networkidle2',
        timeout: 60000
      });

      // Đợi cho phần bình luận tải
      await page.waitForSelector('#comments', { timeout: 30000 });
      
      // Cuộn xuống để tải thêm bình luận
      await this._autoScroll(page, 5); // Cuộn 5 lần
      
      // Thu thập dữ liệu bình luận
      const comments = await page.evaluate((limit) => {
        const commentElements = document.querySelectorAll('ytd-comment-thread-renderer');
        const results = [];
        
        for (let i = 0; i < Math.min(commentElements.length, limit); i++) {
          const element = commentElements[i];
          
          const authorElement = element.querySelector('#author-text');
          const contentElement = element.querySelector('#content-text');
          const likeCountElement = element.querySelector('#vote-count-middle');
          
          if (authorElement && contentElement) {
            results.push({
              author: authorElement.textContent.trim(),
              content: contentElement.textContent.trim(),
              likes: likeCountElement ? parseInt(likeCountElement.textContent.trim() || '0') : 0,
              timestamp: new Date().toISOString()
            });
          }
        }
        
        return results;
      }, commentLimit);
      
      return comments;
    } catch (error) {
      console.error('Lỗi khi thu thập bình luận YouTube:', error);
      return [];
    } finally {
      await page.close();
    }
  }

  /**
   * Thu thập bài đăng từ Twitter/X về một từ khóa
   * @param {string} keyword - Từ khóa cần tìm
   * @param {number} postLimit - Số lượng bài đăng tối đa
   */
  async getTwitterPosts(keyword, postLimit = 20) {
    await this.initialize();
    
    const page = await this.browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    try {
      // Tìm kiếm trên Twitter/X (sử dụng URL tìm kiếm)
      const encodedKeyword = encodeURIComponent(keyword);
      await page.goto(`https://twitter.com/search?q=${encodedKeyword}&src=typed_query&f=live`, {
        waitUntil: 'networkidle2',
        timeout: 60000
      });

      // Đợi cho phần tweets tải
      await page.waitForSelector('article[data-testid="tweet"]', { timeout: 30000 });
      
      // Cuộn xuống để tải thêm tweets
      await this._autoScroll(page, 3);
      
      // Thu thập dữ liệu tweets
      const tweets = await page.evaluate((limit) => {
        const tweetElements = document.querySelectorAll('article[data-testid="tweet"]');
        const results = [];
        
        for (let i = 0; i < Math.min(tweetElements.length, limit); i++) {
          const element = tweetElements[i];
          
          // Tìm các phần tử trong tweet
          const authorElement = element.querySelector('div[data-testid="User-Name"]');
          const contentElement = element.querySelector('div[data-testid="tweetText"]');
          
          if (authorElement && contentElement) {
            // Lấy thông tin tương tác (like, retweet, reply)
            const interactions = {};
            const statsElements = element.querySelectorAll('div[role="group"] div[data-testid]');
            statsElements.forEach(stat => {
              const testId = stat.getAttribute('data-testid');
              if (testId && (testId.includes('like') || testId.includes('retweet') || testId.includes('reply'))) {
                const count = stat.textContent.trim();
                interactions[testId.split('-')[0]] = count;
              }
            });
            
            results.push({
              author: authorElement.textContent.trim(),
              content: contentElement.textContent.trim(),
              interactions,
              platform: 'Twitter',
              timestamp: new Date().toISOString()
            });
          }
        }
        
        return results;
      }, postLimit);
      
      return tweets;
    } catch (error) {
      console.error('Lỗi khi thu thập dữ liệu Twitter:', error);
      return [];
    } finally {
      await page.close();
    }
  }

  /**
   * Thu thập bài đăng từ Reddit về một từ khóa
   * @param {string} keyword - Từ khóa cần tìm
   * @param {number} postLimit - Số lượng bài đăng tối đa
   */
  async getRedditPosts(keyword, postLimit = 20) {
    await this.initialize();
    
    const page = await this.browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    try {
      // Tìm kiếm trên Reddit
      const encodedKeyword = encodeURIComponent(keyword);
      await page.goto(`https://www.reddit.com/search/?q=${encodedKeyword}&sort=new`, {
        waitUntil: 'networkidle2',
        timeout: 60000
      });

      // Kiểm tra xem có form tuổi không và đóng nó
      try {
        const ageVerifyButton = await page.$('button[data-testid="age-gate-yes-button"]');
        if (ageVerifyButton) {
          await ageVerifyButton.click();
          await page.waitForTimeout(1000);
        }
      } catch (e) {
        // Bỏ qua nếu không có cửa sổ xác nhận tuổi
      }

      // Đợi cho phần posts tải
      await page.waitForSelector('div[data-testid="post-container"]', { timeout: 30000 });
      
      // Cuộn xuống để tải thêm posts
      await this._autoScroll(page, 3);
      
      // Thu thập dữ liệu posts
      const posts = await page.evaluate((limit) => {
        const postElements = document.querySelectorAll('div[data-testid="post-container"]');
        const results = [];
        
        for (let i = 0; i < Math.min(postElements.length, limit); i++) {
          const element = postElements[i];
          
          // Tìm các phần tử trong post
          const titleElement = element.querySelector('h3');
          const authorElement = element.querySelector('a[data-testid="post_author_link"]');
          const scoreElement = element.querySelector('div[data-testid="post-score"]');
          const commentCountElement = element.querySelector('span[data-testid="comments-count"]');
          const linkElement = element.querySelector('a[data-testid="post-title"]');

          if (titleElement) {
            results.push({
              title: titleElement.textContent.trim(),
              author: authorElement ? authorElement.textContent.trim() : 'Unknown',
              score: scoreElement ? scoreElement.textContent.trim() : '0',
              commentCount: commentCountElement ? commentCountElement.textContent.trim() : '0',
              url: linkElement ? linkElement.href : '',
              platform: 'Reddit',
              timestamp: new Date().toISOString()
            });
          }
        }
        
        return results;
      }, postLimit);
      
      return posts;
    } catch (error) {
      console.error('Lỗi khi thu thập dữ liệu Reddit:', error);
      return [];
    } finally {
      await page.close();
    }
  }

  /**
   * Hàm trợ giúp để cuộn trang tự động
   * @param {Page} page - Đối tượng page của Puppeteer
   * @param {number} scrollLimit - Số lần cuộn tối đa
   */
  async _autoScroll(page, scrollLimit = 5) {
    await page.evaluate(async (limit) => {
      await new Promise((resolve) => {
        let scrolls = 0;
        const scrollInterval = setInterval(() => {
          window.scrollBy(0, 800);
          scrolls++;
          
          if (scrolls >= limit) {
            clearInterval(scrollInterval);
            resolve();
          }
        }, 1000);
      });
    }, scrollLimit);
    
    // Chờ thêm một chút để trang tải nội dung mới
    await page.waitForTimeout(2000);
  }

  /**
   * Thu thập dữ liệu từ nhiều nền tảng về một từ khóa
   * @param {string} keyword - Từ khóa cần tìm
   * @param {string} videoId - (Tùy chọn) ID video YouTube để thu thập bình luận
   */
  async getSocialData(keyword, videoId = null) {
    try {
      const results = {
        keyword,
        timestamp: new Date().toISOString(),
        platforms: {}
      };

      // Thu thập dữ liệu từ Twitter
      const twitterPosts = await this.getTwitterPosts(keyword);
      results.platforms.twitter = {
        count: twitterPosts.length,
        posts: twitterPosts
      };

      // Thu thập dữ liệu từ Reddit
      const redditPosts = await this.getRedditPosts(keyword);
      results.platforms.reddit = {
        count: redditPosts.length,
        posts: redditPosts
      };

      // Thu thập bình luận YouTube nếu có videoId
      if (videoId) {
        const youtubeComments = await this.getYouTubeComments(videoId);
        results.platforms.youtube = {
          count: youtubeComments.length,
          comments: youtubeComments
        };
      }

      return results;
    } catch (error) {
      console.error('Lỗi khi thu thập dữ liệu social:', error);
      throw error;
    } finally {
      // Đóng trình duyệt sau khi hoàn thành
      await this.close();
    }
  }
}

module.exports = new SocialListener();