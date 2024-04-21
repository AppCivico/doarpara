export default (input: string): number | null | undefined => {
  const parsedValue = parseFloat(input);

  return !Number.isNaN(parsedValue)
    ? parsedValue
    : null;
};
