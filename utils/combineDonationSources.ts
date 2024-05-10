import type { RaisedAndSource, SourceOnProgressBar } from '@/doar-para.d.ts';

export default ((platforms:RaisedAndSource[]) => {
  let opacity = 0;
  return !Array.isArray(platforms)
    ? []
    : platforms
      .filter((x) => x?.name && x.total_donated !== undefined)
      .map((x: RaisedAndSource) => {
        const y = x as SourceOnProgressBar;
        y.opacity = opacity;
        opacity += 0.25;
        return y;
      });
});
