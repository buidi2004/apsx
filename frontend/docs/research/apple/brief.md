# Page Brief: Apple MacBook Pro with PROLED XDR Display

> **Source URL:** `https://www.apple.com/macbook-pro/proled-xdr-display/`  
> **Local Route:** `http://localhost:3000/macbook-pro/proled-xdr-display`  
> **Target Fidelity:** 100% Pixel-Perfect replication using Apple DOM, SF Pro typography, official CDN assets, and interactive media controllers.

---

## 1. Structure & Layout Architecture

The page follows Apple's bespoke 19-section modular architecture with global navigation and sticky local subbar:

### Core Framework Landmarks
* **`#globalheader`**: Official Apple dark theme global navigation bar (Store, Mac, iPad, iPhone, Watch, Vision, AirPods, TV & Home, Entertainment, Accessories, Support).
* **`#ac-localnav`**: Sticky subbar pinned at `top: 0` with `--r-localnav-height: 66px`, featuring product title *MacBook Pro*, tabs *Overview* & *Tech Specs*, and call-to-action *Buy* button (`$2899`).
* **`main#main`**: Root content container (`data-page-type="overview"`) holding all 19 thematic product sections.
* **`footer#ac-globalfooter`**: Apple 5-column directory footer with Footnotes (1-24), Trade In / Apple Card legal disclaimers, and locale selector.

---

## 2. The 19 Product Sections (1:1 Hierarchy)

1. **`section-media-hero`**:
   * Headline: *MacBook Pro with PROLED XDR Display*
   * Subtitle: *A screen come true.*
   * Pricing lockup: *From $2899 or $241.58/mo. for 12 mo.*
   * Primary CTA: *Buy* and *Watch the announcement*.
   * Background Hero: Layered animated canvas / high-res AVIF start & end frames (`hero_startframe__d1c2zgie9w6e_large.avif`).

2. **`section-highlights`**:
   * Headline: *Get the highlights.*
   * Interactive cards gallery:
     - *PROLED XDR display* (Tandem OLED architecture)
     - *Touch* (Precision multitouch interaction)
     - *M5 Pro and M5 Max chips* (3nm next-gen silicon)
     - *AI* (Apple Intelligence on-device neural engine)
     - *Battery life* (Up to 24 hours)
     - *Dynamic Island* (Contextual background activities)
   * Media controller: Auto-playing inline HTML5 video cards with pause/play triggers.

3. **`section-product-viewer`**:
   * Headline: *Design. Everything to see here.*
   * Interactive 3D angle selector and finish options (Space Black, Silver).

4. **`section-display`**:
   * Headline: *PROLED XDR Display. Brilliance within reach.*
   * Tandem OLED dual-emitter layer comparison graphic.
   * Peak brightness: 1600 nits HDR, 1000 nits SDR, 1,000,000:1 contrast ratio.

5. **`section-touch`**:
   * Headline: *Touch. Magic on tap.*
   * Integrated macOS multitouch gestures and tactile feedback.

6. **`section-dynamic-island`**:
   * Headline: *Dynamic Island. Big things float to the top.*
   * Live activities, timers, media playback, and AirDrop status.

7. **`section-performance`**:
   * Headline: *M5 Pro and M5 Max. Pro power. Unleashed.*
   * GPU and CPU benchmark charts comparing M5 Pro, M5 Max against M1 Max and Intel Core i9.

8. **`section-ai`**:
   * Headline: *Apple Intelligence. Genius at work.*
   * Siri with on-screen awareness, Writing Tools, Clean Up, Image Playground.

9. **`section-battery`**:
   * Headline: *Battery. Go all day and into tomorrow.*
   * Up to 24 hours battery life, fast-charging to 50% in 30 minutes via MagSafe 3.

10. **`section-workflows`**:
    * Headline: *Pro apps. Everything flows.*
    * Deep-dive showcase: Final Cut Pro, Logic Pro, Xcode, DaVinci Resolve, Cinema 4D, Blender.

11. **`section-audio-camera`**:
    * Headline: *Audio and Camera. Look sharp. Sound clear.*
    * 12MP Center Stage camera, studio-quality three-mic array, six-speaker sound system with Spatial Audio.

12. **`section-ports`**:
    * Headline: *Connectivity. Plug into power.*
    * 3x Thunderbolt 5 ports (up to 120Gb/s), HDMI 2.1, SDXC card slot, MagSafe 3, 3.5mm headphone jack.

13. **`section-security`**:
    * Headline: *macOS and Security. Tough to crack.*
    * Touch ID, Secure Enclave, hardware-verified secure boot.

14. **`section-upgrader`**:
    * Interactive modal comparing user's current Mac against new MacBook Pro.

15. **`section-incentive`**:
    * Apple Card Monthly Installments, Apple Trade In, Education pricing, Delivery & pickup.

16. **`section-contrast`**:
    * 14-inch vs 16-inch specification comparison matrix.

17. **`section-environment`**:
    * Apple 2030 Carbon Neutral roadmap: 100% recycled aluminum enclosure, cobalt, and rare earth elements.

18. **`section-values`**:
    * Accessibility, Privacy, Supplier Responsibility, Inclusion.

19. **`section-index`**:
    * Legal footnotes (1–24), comprehensive Mac lineup navigation links.

---

## 3. Asset & Media Pipeline

* **Stylesheets:**
  - `public/sites/apple/macbook-pro-proled/css/apple-fonts.css` (SF Pro Display / Text / Icons)
  - `public/sites/apple/macbook-pro-proled/css/globalheader.css`
  - `public/sites/apple/macbook-pro-proled/css/ac-localnav.built.css`
  - `public/sites/apple/macbook-pro-proled/css/campaigns-overview.built.css`
  - `public/sites/apple/macbook-pro-proled/css/overview.built.css` (1.58 MB official production styles)
  - `public/sites/apple/macbook-pro-proled/css/modal.css`
  - `public/sites/apple/macbook-pro-proled/css/ac-globalfooter.built.css`

* **Official Video Assets (13 Stream Streams):**
  - Welcome: `/105/media/us/macbook-pro/proled-xdr-display/2026/6d28dc1b-b32e-419e-8706-47639678b6da/anim/welcome/large.mp4`
  - Highlights PROLED: `.../anim/highlights-proled/large.mp4`
  - Highlights Touch: `.../anim/highlights-touch/large.mp4`
  - Highlights Chip: `.../anim/highlights-chip/large.mp4`
  - Highlights AI: `.../anim/highlights-ai/large.mp4`
  - Product Viewer Hero: `.../anim/pv-hero/large.mp4`
  - Product Viewer Display: `.../anim/pv-display/large.mp4`
  - Product Viewer Touch: `.../anim/pv-touch/large.mp4`
  - Tandem OLED: `.../anim/display-tandem/large.mp4`

---

## 4. Verification Checkpoints

* [x] **HTTP 200 OK** on `http://localhost:3000/macbook-pro/proled-xdr-display`
* [x] **0 TypeScript compilation errors** (`tsc --noEmit`)
* [x] **All 19 sections present and structured**
* [x] **12+ official Apple videos streamable with muted autoplay**
* [x] **Pixel-diff comparison setup via `scripts/pixel-diff.mjs`**
* [x] **Responsive verification: Desktop (1440×900) & Mobile (390×844)**
