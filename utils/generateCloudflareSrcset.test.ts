import { describe, expect, it } from 'vitest';
import generateCloudflareSrcset from './generateCloudflareSrcset';

const BASE_URL = 'https://doarpara.com.br';
const IMAGE_URL = 'https://example.com/image.jpg';

describe('generateCloudflareSrcset', () => {
  it('should generate srcset with default variants and format=auto', () => {
    const result = generateCloudflareSrcset(IMAGE_URL, BASE_URL);
    expect(result).toBe([
      `${BASE_URL}/cdn-cgi/image/width=520,height=294,fit=cover,format=auto/${IMAGE_URL} 520w`,
      `${BASE_URL}/cdn-cgi/image/width=780,height=440,fit=cover,format=auto/${IMAGE_URL} 780w`,
      `${BASE_URL}/cdn-cgi/image/width=1023,height=577,fit=cover,format=auto/${IMAGE_URL} 1023w`,
      `${BASE_URL}/cdn-cgi/image/width=1560,height=880,fit=cover,format=auto/${IMAGE_URL} 1560w`,
      `${BASE_URL}/cdn-cgi/image/width=2046,height=1154,fit=cover,format=auto/${IMAGE_URL} 2046w`,
    ].join(', '));
  });

  it('should use the provided baseUrl', () => {
    const result = generateCloudflareSrcset(IMAGE_URL, 'https://staging.doarpara.com.br');
    expect(result).toContain('https://staging.doarpara.com.br/cdn-cgi/image/');
  });

  it('should use custom variants when provided', () => {
    const result = generateCloudflareSrcset(IMAGE_URL, BASE_URL, [[400, 225], [800, 450]]);
    expect(result).toBe([
      `${BASE_URL}/cdn-cgi/image/width=400,height=225,fit=cover,format=auto/${IMAGE_URL} 400w`,
      `${BASE_URL}/cdn-cgi/image/width=800,height=450,fit=cover,format=auto/${IMAGE_URL} 800w`,
    ].join(', '));
  });

  it('should handle image URLs with query parameters', () => {
    const urlWithQuery = 'https://s3.amazonaws.com/bucket/image.jpg?token=abc&expires=123';
    const result = generateCloudflareSrcset(urlWithQuery, BASE_URL, [[780, 440]]);
    expect(result).toBe(
      `${BASE_URL}/cdn-cgi/image/width=780,height=440,fit=cover,format=auto/${urlWithQuery} 780w`,
    );
  });

  describe('format parameter', () => {
    it('should use webp format when specified', () => {
      const result = generateCloudflareSrcset(IMAGE_URL, BASE_URL, [[780, 440]], 'webp');
      expect(result).toBe(
        `${BASE_URL}/cdn-cgi/image/width=780,height=440,fit=cover,format=webp/${IMAGE_URL} 780w`,
      );
    });

    it('should use avif format when specified', () => {
      const result = generateCloudflareSrcset(IMAGE_URL, BASE_URL, [[780, 440]], 'avif');
      expect(result).toBe(
        `${BASE_URL}/cdn-cgi/image/width=780,height=440,fit=cover,format=avif/${IMAGE_URL} 780w`,
      );
    });

    it('should use jpeg format when specified', () => {
      const result = generateCloudflareSrcset(IMAGE_URL, BASE_URL, [[780, 440]], 'jpeg');
      expect(result).toBe(
        `${BASE_URL}/cdn-cgi/image/width=780,height=440,fit=cover,format=jpeg/${IMAGE_URL} 780w`,
      );
    });
  });
});
