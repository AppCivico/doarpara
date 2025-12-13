import { describe, expect, it } from 'vitest';
import getYoutubeThumbnail from './getYoutubeThumbnail';

describe('getYoutubeThumbnail', () => {
  describe('with URL string input', () => {
    it('should generate thumbnail URL from standard youtube.com watch URL', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      const result = getYoutubeThumbnail(url);
      expect(result).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg');
    });

    it('should generate thumbnail URL from youtu.be short URL', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ';
      const result = getYoutubeThumbnail(url);
      expect(result).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg');
    });

    it('should generate thumbnail URL from embed URL', () => {
      const url = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
      const result = getYoutubeThumbnail(url);
      expect(result).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg');
    });

    it('should generate thumbnail URL from shorts URL', () => {
      const url = 'https://www.youtube.com/shorts/dQw4w9WgXcQ';
      const result = getYoutubeThumbnail(url);
      expect(result).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg');
    });

    it('should return empty string for invalid URL', () => {
      const url = 'https://example.com/not-a-video';
      const result = getYoutubeThumbnail(url);
      expect(result).toBe('');
    });

    it('should return empty string for empty string', () => {
      const result = getYoutubeThumbnail('');
      expect(result).toBe('');
    });
  });

  describe('with ID object input (CPU optimized path)', () => {
    it('should generate thumbnail URL from ID object', () => {
      const result = getYoutubeThumbnail({ id: 'dQw4w9WgXcQ' });
      expect(result).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg');
    });

    it('should return empty string for empty ID', () => {
      const result = getYoutubeThumbnail({ id: '' });
      expect(result).toBe('');
    });

    it('should handle ID object with different quality', () => {
      const result = getYoutubeThumbnail({ id: 'dQw4w9WgXcQ' }, 'high');
      expect(result).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/sddefault.jpg');
    });
  });

  describe('quality parameter', () => {
    const testId = 'dQw4w9WgXcQ';

    it('should generate URL with lowest quality', () => {
      const result = getYoutubeThumbnail({ id: testId }, 'lowest');
      expect(result).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg');
    });

    it('should generate URL with low quality', () => {
      const result = getYoutubeThumbnail({ id: testId }, 'low');
      expect(result).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg');
    });

    it('should generate URL with medium quality', () => {
      const result = getYoutubeThumbnail({ id: testId }, 'medium');
      expect(result).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg');
    });

    it('should generate URL with high quality', () => {
      const result = getYoutubeThumbnail({ id: testId }, 'high');
      expect(result).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/sddefault.jpg');
    });

    it('should generate URL with max quality (default)', () => {
      const result = getYoutubeThumbnail({ id: testId }, 'max');
      expect(result).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg');
    });

    it('should default to max quality when not specified', () => {
      const result = getYoutubeThumbnail({ id: testId });
      expect(result).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg');
    });
  });

  describe('format parameter', () => {
    const testId = 'dQw4w9WgXcQ';

    it('should generate URL with jpg format (default)', () => {
      const result = getYoutubeThumbnail({ id: testId });
      expect(result).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg');
    });

    it('should generate URL with webp format', () => {
      const result = getYoutubeThumbnail({ id: testId }, 'max', 'webp');
      expect(result).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.webp');
    });

    it('should generate URL with jpg format explicitly', () => {
      const result = getYoutubeThumbnail({ id: testId }, 'max', 'jpg');
      expect(result).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg');
    });
  });

  describe('edge cases', () => {
    it('should handle URL with query parameters', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s';
      const result = getYoutubeThumbnail(url);
      expect(result).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg');
    });

    it('should handle URL with timestamp fragment', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ#t=42';
      const result = getYoutubeThumbnail(url);
      expect(result).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg');
    });

    it('should prioritize object id over string parsing', () => {
      // This ensures the CPU-optimized path is used
      const result = getYoutubeThumbnail({ id: 'test123test' });
      expect(result).toBe('https://i.ytimg.com/vi/test123test/maxresdefault.jpg');
    });
  });
});
