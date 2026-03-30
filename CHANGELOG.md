# Changelog

- fix: double vertical scrollbars
- fix: ARIA markup
- fix: tab navigation links scrolling page to top on route change

## v3.4.20 - 2026-03-27

- fix: Worker exhaustion from `swr: false` — revert to `swr: true` with explicit `staleMaxAge` so expired entries are served stale briefly while Nitro revalidates in background

## v3.4.19 - 2026-03-26

- fix: Type script error on build

## v3.4.18 - 2026-03-26

- fix: purge stale KV cache on 403 in addition to 404
- fix: disabled campaigns to stay live indefinitely
- fix: HTTP 200 responses with `error` being cached

## v3.4.17 - 2026-03-26

- fix: disabled campaigns to stay live indefinitely

## v3.4.16 - 2026-03-26

- fix: KV cache purging

## v3.4.15 - 2026-03-25

- fix: Nitro cache entries

## v3.4.14 - 2026-03-25

- fix: Nitro cache purging

## v3.4.13 - 2026-03-24

- perf: Simplify calculating current goal
- perf: Load testimonies on client side only
- perf: Simplify donations summary
- perf: Improve render of campaign progress bars
- perf: Saves cached campaigns between navigation
- fix: Purge stale KV cache entries when campaign returns 404
- fix: Disable Sentry on local development environment
- perf: Increase KV cache duration to 30s with a 5s stale window to reduce Worker revalidations
- doc: Clarify stale cache settings

## v3.4.12 - 2026-03-20

- build: Try to fix build

## v3.4.11 - 2026-03-20

- build: Try to fix build
- build: Update obsolete dependency: Persist state

## v3.4.10 - 2026-03-20

- fix: Debug message showing on public site
- doc: Annotate cache KV Cache purging

## v3.4.9 - 2026-03-19

- refactor: Use Cloudflare transform on cover images

## v3.4.8 - 2026-03-18

- fix: Disable close button while donation is pending

## v3.4.7 - 2026-03-18

- feat: Make header image faster to show
- feat: Get responsive images for cover
- feat: Update donation taxes

## v3.4.6 - 2026-03-18

- fix: Can't enable pre-campaign donations
- fix: Too stale of API responses

## v3.4.5 - 2026-03-10

- fix: CSP issues

## v3.4.4 - 2026-03-10

- fix: Google Tag Manager missing from CSP image sources

## v3.4.3 - 2026-03-10

- fix: Wrong Google Analytics ID in production

## v3.4.2 - 2026-03-10

- fix: Wrong Google Analytics ID in production

---

## v3.4.1 - 2026-03-09

- fix: Google Analytics default tag stopped to load

---

## v3.4 - 2026-03-09

- feat: Adjust receipts for political parties
- fix: Alias URL of receipts being cached
- feat: Improve error handling on receipts page
- feat: Prevent issues with `null` values coming from API
- feat: Add browser caching
- perf: Add cache on the edge using Cloudflare Workers
- infra: Increase CPU time limit to 5 minutes
- perf: Create KV Namespaces in Cloudflare for cache
- feat: Auto refresh on chunk load errors
- perf: Avoid uploading build files to Workers
- fix: 404 error messages can't tell the difference between wrong route or campaign
- fix: Missing common files `manifest.json` and `robots.txt`
- fix: Images from Youtube CDN not loading due to CSP
- fix: Facebook tracking script being blocked by CSP
- fix: Donation page loading only from homepage
- build: Set env variables on wrangler config
- build: Update node version
- build: Disable dev tools when building on server
- feat: Don't crash SSR, show error page instead
- fix: Broken homepage link
- perf: Optimize Youtube related code
- perf: Simplify sections listing
- feat: Improve error handling on clipboard
- fix: Transition expand component do not shrink enough
- feat: Load donation form on client side only

## v3.3 - 2024-05-17

- fix: Focus indicator clipping text of links
- fix: Alignment of empty donations table
- feat: Conditionally show/hide precampaign data
- fix: List of goals wrong when there's an achieved one
- feat: Add goals list
- fix: Style of links on footer
- fix: ToS link

## v3.2 - 2024-05-08

- feat: Install GTag module
- feat: Add Google Analytics tracking
- feat: Add error page
- feat: Animate total donations value
- feat: Auto format credit card holder name
- feat: Improve styles of loading more donations button
- feat: Update styles of error panel
- fix: Reorder style due to specificity issues
- fix: Division by zero
- fix: Outdated content on email templates
- feat: Add email templates
- fix: Outdated links on email templates
- fix: Outdated brand name on email templates
- fix: Outdated links to control panel on email templates
- fix: Outdated links to external images on email templates
- fix: Outdated logotype on emails
- fix: Outdated credit card taxes
- feat: Customize URL segments
- fix: Vendor VotoLegalFP not always loading
- feat: Manually localize routes

## v3.1 - 2024-04-21

- feat: Stylize PIX payment success message
- feat: Improve shadow mixin
- feat: Enable autocomplete for ZIP code
- feat: Improve phone number and zip code typing
- refactor: Replace `process.` by `import.meta.`
- fix: Requests panel over closing button
- feat: Improve donation form header
- feat: Force links on messages to open on new window
- fix: Amounts not converted from cents on donations list
- fix: Donor data not persisting
- fix: Show cents on donations list
- fix: Duplicated request
- fix: SEO metatags not loading
- fix: Social networks links changing order
- fix: Social links without a default icon
- fix: Donation value being changed by mouse wheel
- fix: Hardcoded totals on donation indicators
- fix: Wrong values on indicators of donations
- fix: Pagination of donations
- fix: Donation indicator showing unnecessarily
- fix: "Load more" button always present
- fix: Donation buttons without enough contrast on hover
- fix: Donation refused due to decimal places
- fix: Remove credit card testing data
- fix: Alignment of number fields values
- fix: custom pledge alignment on iOS
- fix: Custom pledge hovering style
- feat: Improve layout of request feedback messages
- feat: Improve postal code filling on mobile
- feat: Add debug helper

## v3.0 - 2024-03-31

_Relaunch as DoarPara (previously VotoLegal v2, originally VotoLegal)._

- refactor: Move declaration to make more obvious to other devs
- fix: Outdated text
- refactor: Remove unused code
- fix: Code annotation causing warnings
- fix: Prevent conflicts on stylizing outlines of focused elements
