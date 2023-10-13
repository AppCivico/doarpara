export default (videoUrl: string) => {
  if (!videoUrl) return '';

  const youtubeMatch = videoUrl.match(
    /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/,
  );
  if (youtubeMatch && youtubeMatch[1].length === 11) {
    return youtubeMatch[1];
  }
  return '';
};
