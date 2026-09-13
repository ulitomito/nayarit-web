# QA visual móvil

- Source visual truth: `/tmp/codex-remote-attachments/01a0996e-16ec-7413-94fd-90549f7306c9/8DAA024C-8E71-4360-82C3-C51689F5A9AA/1-Photo-1.jpg`
- Implementation screenshot: `/tmp/nre-mobile-implementation.png`
- Normalized comparison: `/tmp/nre-mobile-comparison.png`
- Source pixels: `588 x 1280`; app-owned region cropped to `588 x 1105` and normalized to `390 x 735`.
- Implementation pixels: `390 x 735`.
- CSS viewport: `390 x 735`, device scale factor `1`.
- State: landing page scrolled to the end, fixed header visible, language `es`, mobile menu closed.

## Full-view comparison evidence

The normalized side-by-side comparison checks the same bottom-of-page state. In the
source, the header actions continue beyond the right edge and the last card is separated
from the footer by about `80px` of section padding. In the revised implementation, the
last visible header control ends at `382px` inside a `390px` viewport, document
`scrollWidth` equals `clientWidth` (`390px`), and the measured gap between the last card
and footer is `0px`.

## Focused region comparison evidence

- Header: the logo, complete brand name, language selector and menu toggle are visible at
  `390px`. At `320px`, the language label and chevron collapse while the flag remains;
  the final control ends at `312px` and `scrollWidth` remains `320px`.
- Page ending: the heritage card meets the footer without the former blank band. The
  footer itself remains unchanged.
- The white strip containing the domain in the supplied image is Safari browser chrome,
  not app-owned page content, and is therefore intentionally not recreated or hidden.

## Required fidelity surfaces

- Fonts and typography: existing brand fonts, weights, copy and hierarchy preserved;
  mobile-only type sizes are reduced enough to fit without truncating the brand.
- Spacing and layout rhythm: header spacing now fits `320px` through `390px`; the mobile
  bottom section padding is removed while tablet/desktop spacing remains unchanged.
- Colors and visual tokens: existing cream, green and gold tokens are unchanged.
- Image quality and asset fidelity: supplied logo assets are unchanged and remain sharp;
  no assets were replaced or recreated.
- Copy and content: all visible copy is unchanged.

## Interaction and runtime checks

- Mobile menu opens and exposes Inicio, Destinos, Plusvalía, Certeza Legal, Blog,
  Contacto and the WhatsApp action; it closes normally.
- No horizontal overflow at `320px` or `390px`.
- Browser console errors checked: none.
- Production build completed successfully.

## Comparison history

1. Initial finding — P1: header controls extended to `472.16px` in a `381px` client area,
   clipping WhatsApp and the menu. Fix: compact mobile brand and language controls, hide
   the duplicated header WhatsApp action below `sm`, and reserve fixed space for the menu.
   Post-fix evidence: rightmost control ends at `382px` in `390px`.
2. Initial finding — P2: the final contact card had an `80px` mobile gap before the
   footer. Fix: retain top padding and set mobile bottom padding to zero. Post-fix
   evidence: measured gap is `0px`.
3. Initial finding — P2: the custom desktop scrollbar consumed `9px` at mobile
   breakpoints. Fix: hide the custom scrollbar below `640px`, matching iOS overlay
   behavior. Post-fix evidence: `clientWidth` and `scrollWidth` both equal the viewport.

No actionable P0, P1 or P2 findings remain. No focused crop beyond the header and page
ending was needed because the requested change does not alter other sections.

final result: passed
