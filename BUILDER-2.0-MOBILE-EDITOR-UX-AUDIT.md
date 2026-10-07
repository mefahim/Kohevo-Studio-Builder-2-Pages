# Builder 2.0 Editor UX Audit

## Scope

This phase refines the standalone Kohevo Builder 2.0 visual prototype only. It does not modify the production PHP/backend, add APIs, add dependencies, or create a second document/state model.

The desktop and mobile Builder surfaces reuse the existing `state`, history, node model, responsive overrides, Navigator data, and insertion catalog.

## Desktop topbar Add workflow

The desktop Add workspace is now compact and topbar-based. The former large left Add panel is hidden on desktop so the canvas recovers the full left-side width while the right contextual Inspector remains available.

The topbar contains:

- Add trigger
- Sections
- Elements
- Components
- Dynamic
- Media
- Templates
- AI

The Add trigger and each category open the same searchable insertion popover. The popover retains Preview and Add actions and uses the existing insertion/state/history architecture.

The categories are independent. Selecting **Elements** renders the real element catalog, including Container, Stack, Grid, Flex, Columns, Text, Heading, Image, Button, Divider, Icon, Rich Text, Video, List, Card, Quote, Tabs, Accordion, Modal and Carousel. Selecting **Components** renders the separate native Kohevo component catalog, including Services, Service List, Service Card, Booking CTA, Booking Calendar, Membership Plans, Form, Staff, Location, Posts and Customer Portal.

## Mobile information architecture

The mobile Builder is canvas-first. It uses a compact context header and a compact horizontal action row directly below it for Blocks, Edit, Theme, Preview and More. This row is in the topbar area rather than consuming the bottom of the canvas.

Mobile sheets expose the full capability surface through contextual, scrollable panels with close actions, scrims, safe-area padding and visible focus states. Blocks provides searchable Sections, Elements, Components, Dynamic, Media, Templates and AI categories. Edit exposes contextual content, component, layout, typography, spacing, background, border, effects, responsive, visibility, interactions, advanced and delete controls. Theme exposes Brand, Colors, Typography, Buttons, Spacing and Components. More exposes Layers, Page settings, SEO, History, Comments, Keyboard shortcuts and Help.

## Layers / Navigator

Layers remains secondary and uses the existing hierarchy renderer. Touch-friendly rows expose selection, collapse, lock, hide, duplicate and delete actions, plus explicit Move up, Move down, Move into and Move out alternatives so mobile users do not depend on drag and drop.

## Responsive breakpoint distinction

The physical editor surface and the edited breakpoint remain independent. A phone-shaped mobile editor can edit Desktop, Tablet or Mobile values through the existing `responsive.overrides` model and inherited/reset behavior.

## Verification performed

1. Local HTTP preview served from `0.0.0.0:4174`.
2. Desktop Builder reloaded after the topbar refactor.
3. Confirmed the large desktop left Add panel is hidden and the canvas width is recovered.
4. Confirmed topbar Add, Sections, Elements, Components, Dynamic, Media, Templates and AI controls are visible.
5. Clicked Elements and verified 20 real element results.
6. Clicked Components and verified 11 separate native Kohevo component results.
7. Confirmed search, Preview and Add actions remain available in the desktop popover.
8. Mobile narrow-mode shell and topbar action row were also preserved.
9. Ran JavaScript syntax and whitespace checks.

## Known limitations

This remains a standalone visual prototype. Save, SEO, comments, help and some Theme/Page settings are representative UI flows rather than backend persistence. Preview uses the prototype canvas rather than a separately rendered published URL.
