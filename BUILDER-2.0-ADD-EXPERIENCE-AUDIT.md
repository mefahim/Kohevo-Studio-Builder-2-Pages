# Kohevo Studio — Builder 2.0 Add / Insert Experience Audit

## What existed

- A technical left Add panel with a small set of static palette buttons.
- Desktop insertion buttons that added generic nodes.
- A separate mobile Add drawer with a short static palette.
- Canvas selection, Navigator and Inspector state already available from the previous phase.

## What changed

- Replaced the desktop Add panel content with a visual library organized into Sections, Elements, Components, Dynamic, Media, Templates and AI.
- Added live search across names, descriptions, categories and Kohevo business components.
- Added visual thumbnails, descriptors, Preview, Add and favorite controls.
- Added section library categories including Hero, Features, Services, Pricing, Testimonials, FAQ, Team, Gallery, Booking, Contact, CTA and Footer.
- Added grouped element library for Layout, Basic, Content and Interactive elements.
- Added native-looking Kohevo business components such as Booking CTA, Booking Calendar, Service Card, Membership Plans, Staff, Location, Posts and Customer Portal.
- Added lightweight Template cards with Preview and Use/Add behavior.
- Added believable drag-and-drop from the library to the canvas, with a highlighted insertion zone and drop confirmation.
- Added Cmd/Ctrl+K quick insert overlay with search, results and Enter-to-insert behavior.
- Upgraded the mobile Add drawer into a bottom-sheet flow with category chips, sticky search, visual cards, preview and large Add targets.
- Every insert uses the existing state/history path, selects the new node, updates Navigator/Inspector and supports undo/redo.

## Prototype-only behavior

- Inserted nodes are representative demo nodes rather than production-rendered section systems.
- Preview is a concise prototype preview state/toast rather than a full template preview screen.
- Drag-and-drop uses the browser drag API and a canvas insertion indicator; it is not a production layout engine.
- Favorites are session-only.
- No backend, CMS, file upload, database or production Kohevo architecture was changed.

## UX issues discovered

- A broad catalog can make the left panel scroll-heavy at narrow desktop widths; live search and category filtering mitigate this.
- External demo imagery remains network-dependent.
- Advanced keyboard navigation is represented by Enter/Escape and the quick overlay, but a full focus-management system is outside this standalone prototype.

## Verification scope

Browser verification covered section search, element search, Kohevo/business search, click-to-add, drag/drop affordance, selection feedback, Navigator/Inspector synchronization, undo/redo, Cmd/Ctrl+K, Escape, no-results state, mobile Add drawer and mobile insertion.
