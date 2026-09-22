# Homepage performance fixes

Baseline: PageSpeed report `of80wyuhr7`, captured September 21, 2026.

| Metric | Mobile | Desktop |
| --- | --- | --- |
| Performance score | 55 | 41 |
| Largest Contentful Paint | 23.0 s | 4.7 s |
| Total Blocking Time | 470 ms | 890 ms |
| Transferred payload | 6,947 KiB | 6,834 KiB |

Reports: [mobile](https://pagespeed.web.dev/analysis/http-radiconlab-com/of80wyuhr7?form_factor=mobile), [desktop](https://pagespeed.web.dev/analysis/http-radiconlab-com/of80wyuhr7?form_factor=desktop).

## Changes

- Serve the hero and remaining homepage images through Next.js responsive image optimization. Give the first hero image high fetch priority and remove the initial hidden animation from its image and text.
- Lazy-load below-the-fold images with explicit dimensions or sized containers. Supply responsive sizes for the mission images.
- Attach video sources only when each video enters the viewport; pause videos when they leave. This also keeps the third-party CloudFront video flagged by the cache audit out of initial loading.
- Initialize reCAPTCHA near visible forms, and only enable the appointment form widget when its modal opens. Keep space reserved for the widget.
- Fetch Google Translate after a language choice, or when restoring a saved translation cookie. Wait for its asynchronously created selector before applying the requested language.
- Load the analytics library during browser idle time while preserving its early event queue.
- Give carousel navigation buttons accessible names.

## Validation

- Production build and TypeScript check passed.
- ESLint passed for changed source files.
- Headless Chrome checks passed at 412 x 915 and 1440 x 900: optimized hero loaded and visible, no uncaught JavaScript exceptions, no initial video/reCAPTCHA/translation requests, and video activation/pause worked on scrolling.
- Local production image responses returned WebP: 11,132 bytes at width 640 and 43,598 bytes at width 1920, versus the original 1,629,833-byte PNG. This measures asset savings, not a Lighthouse score improvement.

## Deployment verification

Deploy the production build and rerun PageSpeed for mobile and desktop. No post-deployment performance score has been measured. The host must support the Next.js image optimizer at `/_next/image`.

Third-party cache headers cannot be changed in this repository; the external video may still appear in cache audits after scrolling. Full reCAPTCHA verification requires the deployment's configured site key and backend. Existing accessibility/SEO findings outside the changes above remain separate work.
