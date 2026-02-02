export default (value: string) => (value || '')
  .trim()
  .split(' ')
  .filter((x) => x)
  .map((x, i) => (i === 0 ? x : x.replace(/(?!^).(?!$)/g, '*')))
  .join(' ');
