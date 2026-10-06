# Builder 2.0 — Responsive Editing 2.0 Correctness Pass

## Scope

This was a focused correction to the existing standalone Builder 2.0 prototype. No production backend, PHP architecture, database, API, dependency, or editor framework was changed.

## Responsive inheritance fixes

Responsive lookup now uses chained inheritance. Desktop is the base; Tablet falls back to Desktop; Mobile falls back to Tablet and then Desktop. Reset removes only the active breakpoint override. The same nearest-parent behavior is used for responsive visibility. Padding, margin, typography values, layout values and visibility writes are stored against the active breakpoint instead of mutating another breakpoint.

Added nodes have their own responsive state. A Heading's Mobile font-size override therefore does not modify another Heading, a Component, or the Hero.

## Element functionality

The Elements catalog now inserts real stateful nodes with stable IDs, identity, content, style, responsive state, advanced visibility, parent ID, collapsed, locked and hidden state. Representative renderers now distinguish Container, Stack, Grid, Flex, Columns, Text, Heading, Image, Button, Divider, Icon, Rich Text, Video, List, Card, Quote, Tabs, Accordion, Modal and Carousel. Inserted nodes appear on the Canvas and Navigator, become selected, and receive node-aware Inspector controls.

Search and Add were verified. Node content, font size, padding, gap, image fit and visibility can be edited. Duplicate, delete, rename, nesting and cycle prevention continue to use the existing layer system.

## Component functionality

Components are now separated from Templates in the Add semantics. Kohevo-native entries create nodes with component identity and recognizable demo renderers, including Services, Service List, Service Card, Booking CTA, Booking Calendar, Membership Plans, Form, Staff, Location, Posts and Customer Portal. Search is constrained to the active category, so Templates do not leak into a Components search.

Booking Calendar, Membership Plans, Form, Services and Customer Portal were checked as recognizable component renderers. Component selection updates breadcrumbs, Navigator selection, Inspector title and component identity context.

## Inspector contextualization

Hero keeps its specialized Inspector. Added nodes use a lightweight contextual Inspector with Element content, Node style, Responsive, and Visibility & identity sections. Text and Heading support content, typography, spacing and responsive values. Image supports alt text, fit, spacing and responsive visibility. Button supports label, typography, spacing and visibility. Components expose component identity and basic content/configuration representation.

## Verification performed

- `node --check app.js`
- `git diff --check`
- Desktop / Tablet / Mobile switching.
- Desktop 89 → Tablet 64 → Mobile inherited 64.
- Mobile override 36 → reset returns to Tablet 64.
- Tablet reset returns to the Desktop/base value.
- Tablet visibility override inherited by Mobile.
- Elements search returned Heading and Add created a selected node.
- Components search returned Booking CTA and Booking Calendar without Templates.
- Heading, Button and Booking Calendar appeared on Canvas and Navigator.
- Cross-selection Hero → Heading → Button → Booking Calendar → Hero updated Inspector context each time.
- Heading content changed through node Inspector.
- Node responsive font-size override and reset verified.
- Node duplicate, delete and nesting verified.
- Parent IDs and Navigator hierarchy verified.
- Representative element/component renderers produced distinct visual classes.
- Existing Add / Insert, Navigator, Undo / Redo and mobile Builder paths remained available.
- No recursion error occurred while rendering the Navigator after node insertion and nesting.

## Known prototype limitations

Responsive and node state remain frontend-only and are not persisted. The renderer is intentionally representative rather than a complete CSS engine. Some advanced properties are not exposed for every node type. Rename remains prompt-based, and duplicating a parent currently duplicates the selected node while keeping a valid parent relationship rather than cloning an entire descendant subtree.
