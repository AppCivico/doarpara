export default function getDonationFP() {
  return new Promise((resolve, reject) => {
    const d1 = new Date();
    const fp = new VotolegalFP({
      excludeUserAgent: true,
      dontUseFakeFontInCanvas: true,
    });

    fp.get((result, components) => {
      const d2 = new Date();

      const info = {
        ms: d2 - d1,
        id: result,
      };

      for (const index in components) {
        const obj = components[index];

        if (obj.key == 'canvas' || obj.key == 'webgl') {
          info[obj.key] = obj.value.toString().length;
        } else {
          info[obj.key] = obj.value.toString();
        }
      }

      const Base64 = {
        _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
        encode(e) {
          let t = '';
          let n;
          let r;
          let i;
          let s;
          let o;
          let u;
          let a;
          let f = 0;
          e = Base64._utf8_encode(e);
          while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
              u = a = 64;
            } else if (isNaN(i)) {
              a = 64;
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
          }
          return t;
        },
        _utf8_encode(e) {
          e = e.replace(/rn/g, 'n');
          let t = '';
          for (let n = 0; n < e.length; n++) {
            const r = e.charCodeAt(n);
            if (r < 128) {
              t += String.fromCharCode(r);
            } else if (r > 127 && r < 2048) {
              t += String.fromCharCode(r >> 6 | 192);
              t += String.fromCharCode(r & 63 | 128);
            } else {
              t += String.fromCharCode(r >> 12 | 224);
              t += String.fromCharCode(r >> 6 & 63 | 128);
              t += String.fromCharCode(r & 63 | 128);
            }
          }
          return t;
        },
      };

      const donation_fp = Base64.encode(JSON.stringify(info));

      if (donation_fp) {
        resolve(donation_fp);
      } else {
        reject();
      }
    });
  });
}
