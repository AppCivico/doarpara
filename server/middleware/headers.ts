export default defineEventHandler((event) => {
  const host = getHeader(event, 'host') || '';

  // Noindex headers for dev environments
  if (host.includes('pages.dev') || host === 'dev.doarpara.com.br') {
    setHeader(event, 'X-Robots-Tag', 'noindex');
  }

  // Only set security headers for non-dev environments or specific hosts
  setHeader(event, 'Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // X-Frame-Options tells the browser whether you want to allow your site to
  // be framed or not. By preventing a browser from framing your site you can
  // defend against attacks like clickjacking.
  setHeader(event, 'X-Frame-Options', 'SAMEORIGIN');

  // Prevent browsers from incorrectly detecting non-scripts as scripts
  setHeader(event, 'X-Content-Type-Options', 'nosniff');

  // X-XSS-Protection sets the configuration for the cross-site scripting
  // filter built into most browsers.
  setHeader(event, 'X-XSS-Protection', '1; mode=block');

  // Referrer Policy is a new header that allows a site to control how much
  // information the browser includes with navigations away from a document and
  // should be set by all sites.
  setHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin');

  // CORS
  setHeader(event, 'Access-Control-Allow-Origin', '*');

  // CSPs
  // Note: frame-ancestors should match CONTROL_PANEL_ORIGIN for preview mode to work
  const csp = "upgrade-insecure-requests; "
    + "frame-ancestors 'self' "
      + "https://*.doarpara.com.br; "
    + "connect-src 'self' blob: data: "
      + "https://static.cloudflareinsights.com/ "
      + "https://*.google-analytics.com/ "
      + "https://*.facebook.com/ "
      + "https://*.appcivico.com/ "
      + "https://*.votolegal.com/ "
      + "https://*.votolegal.com.br/ "
      + "https://*.doarpara.com/ "
      + "https://*.iugu.com/ "
      + "https://*.sentry.io/ "
      + "; "
    + "frame-src 'self' "
      + "https://*.appcivico.com/ "
      + "https://votolegal-front-pages.cloudflareaccess.com/ "
      + "https://challenges.cloudflare.com/ "
      + "https://www.youtube-nocookie.com/ "
      + "https://youtube-nocookie.com/ "
      + "https://www.youtube.com/ "
      + "https://youtube.com/ "
      + "https://*.iugu.com/ "
      + "; "
    + "img-src 'self' "
      + "https://*.google-analytics.com/ "
      + "https://*.facebook.com/ "
      + "https://*.cloudfront.net/ "
      + "https://*.s3.amazonaws.com/ "
      + "https://*.appcivico.com/ "
      + "https://*.votolegal.com/ "
      + "https://*.votolegal.com.br/ "
      + "http://*.iugu.com/ "
      + "data: blob: "
      + "; "
    + "object-src 'self'; "
    + "script-src 'self' 'unsafe-inline' 'unsafe-eval' " // unsafe-eval needed for VotoLegal Fingerprint
      + "https://browser-update.org/ "
      + "https://*.facebook.com/ "
      + "https://s3.amazonaws.com/downloads.mailchimp.com/ "
      + "https://sentry.eokoe.com/ "
      + "https://storage.googleapis.com/ "
      + "https://www.google-analytics.com/ "
      + "https://www.googletagmanager.com/ "
      + "https://s3.amazonaws.com/ "
      + "https://connect.facebook.net/ "
      + "https://js.iugu.com/ "
      + "https://*.iugu.com/ "
      + "https://challenges.cloudflare.com/ "
      + "https://cdnjs.cloudflare.com/ "
      + "https://static.cloudflareinsights.com/beacon.min.js/ "
      + "data: "
      + "; "
    + "script-src-elem 'self' 'unsafe-inline' "
      + "https://static.cloudflareinsights.com/; "
    + "style-src 'self' 'unsafe-inline' "
      + "https://cdn-images.mailchimp.com/ "
      + "https://cdnjs.cloudflare.com/ "
      + "https://fonts.googleapis.com/ "
      + "; "
    + "font-src 'self' "
      + "https://cdn-images.mailchimp.com/ "
      + "https://fonts.googleapis.com/ "
      + "https://www.google-analytics.com/ "
      + "https://fonts.gstatic.com/ "
      + "https://cdnjs.cloudflare.com/ "
      + "; "
    + "media-src 'self' "
      + "https://*.cloudfront.net/ "
      + "https://google-analytics.com/";

  setHeader(event, 'Content-Security-Policy', csp);
});
