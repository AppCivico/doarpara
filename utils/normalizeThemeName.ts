export default (themeName = 'default') => {
  const trimmedThemeName = themeName.trim();

  return trimmedThemeName.indexOf('theme--') === 0
    ? trimmedThemeName
    : `theme--${trimmedThemeName}`;
}
