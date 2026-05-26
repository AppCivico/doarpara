export default (themeName = 'default') => {
  const trimmed = themeName.trim();

  if (trimmed.startsWith('theme__')) return trimmed;

  // Strip legacy `theme--` prefix before normalizing to new format
  const bare = trimmed.startsWith('theme--') ? trimmed.slice(7) : trimmed;

  return `theme__${bare}`;
};
