import type { RaisedAndSource } from '@/doar-para';

export default (donationSources: RaisedAndSource[]) => donationSources
  .reduce((acc, cur) => {
  // eslint-disable-next-line no-param-reassign
    acc += cur.total_donated;
    return acc;
  }, 0);
