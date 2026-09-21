> Archived Phase 1 research (21 September 2026). Later decisions in the repository README and PHOTO_LOG take precedence: the authorized scope is replacement of the existing site, with its contact details and original logo reused.

# UNIT ALFA — proposed design tokens

Phase 1 specification, not implemented CSS or a page mockup.

## Visual thesis

A drawing sheet beside a working press shop. Real components, readable specifications, graphite structure and safety orange. Photo quality determines image size; decorative treatments must not disguise missing factory evidence.

## Color

| Token         | Value     | Use                                                           |
| ------------- | --------- | ------------------------------------------------------------- |
| Graphite      | `#1C2225` | Main text, header/footer and dark bands                       |
| Drawing paper | `#F3F1EA` | Main light surface and text on graphite                       |
| White         | `#FFFFFF` | Specification sheets and form fields                          |
| Steel text    | `#59646A` | Secondary copy on paper                                       |
| Steel rule    | `#CCD0CF` | Decorative table/section rules; not the only control boundary |
| Safety orange | `#D96824` | Primary CTA fill and small process highlights                 |
| Burnt orange  | `#A74413` | Text links on paper; darker interactive state                 |

Calculated sRGB contrast: graphite/paper **14.24:1**; steel text/paper **5.38:1**; graphite/safety orange **4.56:1**; paper/burnt orange **5.34:1**. Use dark text on the bright orange button. White on safety orange is only **3.53:1**, unsuitable for ordinary-sized button text. Recheck final rendered combinations; do not reduce text opacity. Use graphite field borders and a high-contrast focus outline, not the faint decorative rule token.

## Typography

| Role                                  | Proposed face                       | Treatment                                                          |
| ------------------------------------- | ----------------------------------- | ------------------------------------------------------------------ |
| Display and large headings            | **Barlow Condensed**, 600/700       | Compact engineering character; uppercase only for short headings   |
| Body, navigation, forms               | **Source Sans 3**, 400/600          | Readable open forms, 16–18 px equivalent; line height around 1.55  |
| Machine values and drawing references | Source Sans 3 with tabular numerals | Align capacity columns without making the page resemble a terminal |

Use self-hosted WOFF2 files and retain their licenses during implementation. No Inter-only, Geist-default or Roboto identity. Keep body lines about 60–72 characters. Minimum regular labels 14 px equivalent. Avoid expanded letter-spacing in paragraphs and long all-caps sentences.

## Space and shape

- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96 px equivalents, using rem.
- Maximum content width approximately 1,240 px; mobile gutters 20 px, larger screens 32–48 px.
- Mostly square corners; 2–4 px rounding for controls if useful. No pill-shaped content containers or blanket card shadows.
- Thin rules, left-aligned labels, visible row boundaries in machinery tables. Use background bands sparingly.
- Aim for 44 × 44 px touch controls. Sticky enquiry affordance must leave room for content and mobile safe areas.

## Photography

- Keep the original palette of metal, yellow coatings and real workshop paint. No orange tint over every image.
- Six 345 × 260 catalogue files: contained views around 300–345 CSS px maximum; never crop out mounting edges or holes to fill a shape.
- Plant images: compact documentary views, not stretched panoramic hero backgrounds. Captions distinguish published photography from a current inspection.
- Wider hero imagery requires a sufficiently detailed verified original or an inspected clean video frame. Until then, use a strong headline with an honestly sized part image.
- Click-to-enlarge only when larger source detail exists; a lightbox must not imply unavailable resolution.
- No generic excavator brand image, invented inspection lab or decorative stock welding sparks.

## Motion and interaction

| Interaction         | Proposed behavior                                         | Accessible fallback                                                          |
| ------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Page arrival        | Opacity + at most 12 px translation, 350–450 ms           | Content visible immediately when reduced motion is requested or scripts fail |
| Section reveal      | Once-only, 250–400 ms; stagger at most 60 ms              | No hidden content dependency                                                 |
| Product hover/focus | Border/label emphasis; tiny image movement only if useful | Equivalent keyboard state; no hover-only information                         |
| Gallery             | Labelled next/previous/close; Escape; focus return        | Static image and caption still available                                     |
| Process sequence    | Step selection reveals related machine and part evidence  | All steps remain accessible as a simple list                                 |
| Machine groups      | Native disclosure or accessible accordion                 | Full semantic table remains crawlable                                        |
| RFQ                 | Visible validation, error summary, preserved input        | Native labels and clear textual status                                       |
| Video               | User-initiated playback; descriptive label                | Still photograph plus outbound video link                                    |

No parallax, full-screen loading gate, continuous counters or scroll hijacking. Before/after and virtual plant walk remain optional only if real paired/connected photographs support them.

## Copy rules

Lead with part, process and location. Preferred language: “Battery boxes and fabricated assemblies”, “Mechanical presses: 20 T, 75 T and 160 T”, “Include material, thickness and batch quantity.” Unknown values remain requirements to discuss, not promises. No fake testimonials, output counts, OEM logo strip, awards or invented ISO year.
