export default (len = 40) => [...crypto.getRandomValues(new Uint8Array(999))].map((c) => String.fromCharCode(c).replace(/[^a-zA-Z0-9]/i, '')).join('').substr(0, len);
