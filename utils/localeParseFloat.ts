/**
 * @link https://stackoverflow.com/a/59679285/15425845
 */
export default (s: string, locale?: string): number => {
  // Get the thousands and decimal separator characters used in the locale.
  const [, thousandsSeparator, , , , decimalSeparator] = 1111.1.toLocaleString(locale);

  // Remove thousand separators, and put a point where the decimal separator occurs
  const cleanedString = Array.from(s, (c) => {
    if (c === thousandsSeparator) {
      return '';
    }
    if (c === decimalSeparator) {
      return '.';
    }
    return c;
  }).join('');

  // Now it can be parsed
  return parseFloat(cleanedString);
};
