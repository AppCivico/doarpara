export default (value:string) => value.trim().split(' ').map((x, i) => (i === 0 ? x : x.replace(/(?!^).(?!$)/g, '*'))).join(' ');
