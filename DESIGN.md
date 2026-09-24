# Design System: Giro Certo — Moto Marketplace

## 1. Visual Theme & Atmosphere

Giro Certo feels like a trusted motorcycle specialist with the clarity of a modern buying app. The interface is crisp, practical, and editorial: confident vehicle photography leads; carefully structured facts make comparisons quick; restrained copper details add energy without making the screen feel like a racing game. Density is balanced for everyday mobile use (5/10), layout variance is purposeful (5/10), and motion is fluid but quiet (3/10).

Design for Brazilian riders comparing new and used motorcycles. Keep every important decision visible at a glance: model and year, price in Brazilian reais, mileage, engine size, seller location, and inspection or seller verification. Use natural Brazilian Portuguese and familiar formats such as `R$ 28.900` and `12.400 km`.

## 2. Color Palette & Roles

- **Paper Canvas** (`#F5F5F2`) — Main app background; a soft neutral that keeps bike photography vivid.
- **Gallery White** (`#FFFFFF`) — Search fields, listing surfaces, sheets, and navigation surfaces.
- **Asphalt Ink** (`#202626`) — Main headings, prices, and high-priority labels. Never use pure black.
- **Road Dust** (`#687170`) — Supporting copy, locations, metadata, and inactive icons.
- **Pavement Line** (`#DFE3E0`) — Quiet dividers, field outlines, and card boundaries.
- **Burnt Copper** (`#A84F26`) — The sole accent color for primary actions, selected filters, active navigation, focus rings, and verification emphasis. Keep accent coverage under 10% of a screen.
- **Copper Wash** (`#F4E7DF`) — A pale tint of the sole accent for selected chips and verified-seller backgrounds; pair with dark copper text.

Use neutral grays for secondary hierarchy. Reserve standard red for errors only. Do not introduce blue, green, or another decorative accent into the marketplace palette.

## 3. Typography Rules

- **Display and headings:** Plus Jakarta Sans, semibold or bold, tight but readable tracking (`-0.02em`). Use scale rather than all-caps for hierarchy.
- **Body and interface:** Plus Jakarta Sans, regular or medium, relaxed line height (`1.45–1.6`). Keep supporting descriptions under 65 characters per line where practical.
- **Prices and specs:** Plus Jakarta Sans with tabular numerals when available. Keep `R$` slightly smaller than the amount and align prices consistently.
- **Small labels:** Plus Jakarta Sans, medium weight. Uppercase tracking is limited to short overlines such as `SELEÇÃO GIRO CERTO`.
- **Minimums:** Body copy 14px; metadata 12px only when secondary and high contrast. Do not use Inter or generic serif faces.

## 4. Component Stylings

### Buttons

- Primary actions use Burnt Copper fill, white semibold text, a minimum 48px height, and a 14px radius. Use direct labels such as `Ver anúncio`, `Conversar com vendedor`, or `Anunciar minha moto`.
- Secondary actions use white or transparent surfaces, Asphalt Ink text, and a quiet 1px Pavement Line border.
- Icon-only actions, including favorite, have a 44px minimum touch target and a clear selected state. Show pressed feedback with a brief 1px downward movement or scale to 0.98.

### Search and Filters

- Put the label above the field when a label is needed; never use floating labels.
- Search is a prominent white rounded field with a search glyph, plain prompt text, and a separate 44px filter control.
- Selected filter chips use Copper Wash with dark copper text. Unselected chips use a neutral surface and line. Let only the quick-filter strip scroll horizontally; keep the page itself free of horizontal overflow.

### Motorcycle Listing Cards

- Use a single-column listing feed on mobile. On wider screens use a two-column grid with intentionally varied image crops; never use three equal columns.
- Let the motorcycle image occupy roughly 55–60% of the card. Use a consistent 4:3 or 16:10 crop that preserves the wheels and silhouette.
- Place a small seller or inspection label on the photo only when contrast is sufficient. Place the favorite control in its own 44px target.
- Below the image, show model and version first, then year and mileage, then the price as the strongest numeric element. Put location and seller identity last.
- Use a clean white surface, 1px Pavement Line border, 18px radius, and minimal shadow. Elevation is reserved for floating controls and sheets.

### Trust and Specs

- Verification uses a compact check icon and a clear label such as `Loja verificada` or `Inspecionada`; the signal must never rely on color alone.
- Specs use neutral compact chips or a tidy two-column definition list. Avoid decorative dashboard gauges and excessive badges.

### Bottom Navigation

- Use a white, safe-area-aware bottom bar with four destinations: `Início`, `Favoritos`, `Anunciar`, and `Perfil`.
- The active destination uses Burnt Copper and a short text label. Keep all targets at least 44px tall; keep the bar visually quiet and separate from content.

### Feedback States

- Loading uses skeletons that match the final image and text geometry, with a restrained neutral shimmer.
- Empty results explain what to change and offer a direct action to clear filters.
- Errors appear inline in plain Portuguese with a useful recovery action. Respect system reduced-motion preferences.

## 5. Layout Principles

- Design mobile-first for a 390px viewport, then expand to tablet and desktop without changing the content hierarchy.
- Use a 4-column mobile grid and 20px outer gutters; align cards, search, section titles, and bottom navigation to the same edges.
- Build the home feed in this order: compact brand and profile actions; search and filters; a short editorial/featured motorcycle section; the latest listings; persistent bottom navigation.
- Keep the top of the feed useful immediately. Avoid oversized marketing heroes that push inventory below the fold.
- Use generous separation between discovery sections and compact spacing inside each listing. Let motorcycle photography—not decorative chrome—carry visual weight.
- On wider screens, contain content to a readable maximum width and use a balanced two-column listing grid. On mobile, collapse multi-column content to one column.
- Every element has a distinct spatial zone. Do not overlay text on photos except for small high-contrast labels and controls.
- Keep sticky elements clear of device safe areas and the final listing content.

## 6. Motion & Interaction

- Use short, weighty spring-like feedback for taps and sheet transitions (roughly 180–260ms, ease-out; a spring equivalent of stiffness 100 and damping 20 is suitable).
- Animate only transform and opacity. Do not move layout with animated width, height, top, or left values.
- Use a brief stagger only when a list first appears. Keep listing cards still during normal browsing; no perpetual motion on static content.
- A selected favorite may transition its icon fill once. Active navigation and selected filters should change color and weight immediately.
- Make loading shimmer subtle and stop it when content is ready. Honor `prefers-reduced-motion`.

## 7. Anti-Patterns (Banned)

- No emojis, neon, glows, or saturated multicolor gradients.
- No Inter, pure black, generic serif type, or tiny low-contrast metadata.
- No decorative blue/green accent colors; use copper as the only brand accent.
- No three-column equal card rows, crowded spec grids, or oversized promotional hero that hides inventory.
- No text overlap, clipped motorcycle photos, page-level horizontal scrolling, or controls smaller than 44px.
- No unlabeled icon-only navigation, color-only verification, fake statistics, or fabricated urgency.
- No generic copy such as “Elevate”, “Seamless”, or “Next-Gen”; use concise Brazilian Portuguese.
- No decorative perpetual animation, custom cursors, or loading spinners where a skeleton can show the content shape.
