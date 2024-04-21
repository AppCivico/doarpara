export default (url: string | undefined) => {
  if (!url) return null;
  const match = url.match(/^https?:\/\/(?:www\.)?(?:twitter|x).com\/@?(?<handle>\w+)/);
  return match?.groups?.handle ? `@${match.groups.handle}` : null;
};
