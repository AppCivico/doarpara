import getYoutubeId from './getYoutubeId.ts';

type Quality = 'lowest' | 'low' | 'medium' | 'high' | 'max';

// default -> 120px / 90px
// mqdefault -> 320px / 180px
// hqdefault -> 480px / 360px
// sddefault -> 640px / 480px
// maxresdefault -> 1280px / 720px

export default (
  url: string,
  quality: Quality = 'max',
  format: 'webp' | 'jpg' = 'jpg',
): string | null => {
  if (url) {
    const videoId = getYoutubeId(url);

    if (videoId) {
      let qualityKey: string;

      switch (quality) {
        case 'lowest':
          qualityKey = 'default';
          break;
        case 'low':
          qualityKey = 'mqdefault';
          break;
        case 'medium':
          qualityKey = 'hqdefault';
          break;
        case 'high':
          qualityKey = 'sddefault';
          break;
        case 'max':
        default:
          qualityKey = 'maxresdefault';
          break;
      }

      return `https://i.ytimg.com/vi/${videoId}/${qualityKey}.${format}`;
    }
  }
  return null;
};
