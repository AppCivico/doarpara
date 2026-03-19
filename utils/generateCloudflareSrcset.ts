const DEFAULT_VARIANTS: [number, number][] = [
  [520, 294],
  [780, 440],
  [1023, 577],
  [1560, 880],
  [2046, 1154],
];

const generateCloudflareSrcset = (
  url: string,
  baseUrl = '',
  variants = DEFAULT_VARIANTS,
  format: 'auto' | 'webp' | 'avif' | 'jpeg' | 'baseline-jpeg' = 'auto'
): string => variants
    .map(
      ([w, h]) => `${baseUrl}/cdn-cgi/image/width=${w},height=${h},fit=cover,format=${format}/${url} ${w}w`
    )
    .join(', ');

export default generateCloudflareSrcset;
