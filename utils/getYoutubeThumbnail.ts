import getYoutubeId from './getYoutubeId.ts';

type Quality = 'lowest' | 'low' | 'medium' | 'high' | 'max';

// default -> 120px / 90px
// mqdefault -> 320px / 180px
// hqdefault -> 480px / 360px
// sddefault -> 640px / 480px
// maxresdefault -> 1280px / 720px

export default (
  urlOrId: string | { id: string },
  quality: Quality = 'max',
  format: 'webp' | 'jpg' = 'jpg',
): string => {
  if (!urlOrId) return '';

  // Extract video ID (accepts URL string or { id } object to skip regex)
  let videoId: string;
  if (typeof urlOrId === 'object' && urlOrId.id) {
    videoId = urlOrId.id;
  } else if (typeof urlOrId === 'string') {
    videoId = getYoutubeId(urlOrId);
  } else {
    return '';
  }

  if (!videoId) return '';

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
};
