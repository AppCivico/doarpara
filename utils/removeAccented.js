export default (value) => {
  let newString = value.toLowerCase();
  const mapaAcentosHex = {
    a: /[\xE0-\xE6]/g,
    e: /[\xE8-\xEB]/g,
    i: /[\xEC-\xEF]/g,
    o: /[\xF2-\xF6]/g,
    u: /[\xF9-\xFC]/g,
    c: /\xE7/g,
    n: /\xF1/g,
  };

  Object.keys(mapaAcentosHex)
    .forEach((item) => {
      const expressaoRegular = mapaAcentosHex[item];
      newString = newString.replace(expressaoRegular, item);
    });

  return newString;
};
