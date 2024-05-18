import type { RaisedAndSource } from '@/doar-para';

export default (donationSources: RaisedAndSource[]) => donationSources
  .reduce((acc, cur) => acc + cur.total_donated, 0);
