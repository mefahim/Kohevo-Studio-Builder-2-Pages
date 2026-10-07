# Builder 2.0 Mobile Editor UX Audit

## Scope

This phase refines the existing standalone Kohevo Builder 2.0 prototype only. It does not modify the production PHP/backend, add APIs, add dependencies, or create a second document/state model.

The mobile Builder is a touch-first editor surface over the existing `state`, history, node model, responsive overrides, Navigator data, and insertion catalog.

## Mobile information architecture

- **Phone UI = canvas-first.** The page canvas remains visible until a task requires a sheet.
- **Top bar:** Back, current page/selection context, Undo, Redo, Save and save-state feedback.
- **Top navigation:** Blocks, Edit, Theme, Preview, More are integrated into the compact editor topbar so the canvas does not lose bottom space.
- **Sheets:** compact, medium, tall, and near-full-height variants with handle, sticky header, close action, scrollable body, scrim, safe-area padding, and focus-visible controls.
- **No desktop sidebars:** mobile mode hides the desktop topbar, left palette, right inspector and desktop bottom utility strip.

## Bottom navigation

- **Blocks:** searchable touch-friendly catalog with Sections, Elements, Components, Dynamic, Media, Templates and AI categories. Preview and Add remain available for catalog items. Components include the working Kohevo catalog, including Booking Calendar.
- **Edit:** contextual inspector for the selected Hero, element, or component. Relevant sections are exposed contextually rather than showing an irrelevant desktop inspector.
- **Theme:** separate site-wide workflow for Brand, Colors, Typography, Buttons, Spacing and Components.
- **Preview:** hides editor chrome as far as practical and returns to edit through the mobile Back control.
- **More:** secondary utilities only: Layers, Page settings, SEO, History, Comments, Keyboard shortcuts and Help.

## Contextual mobile Inspector

The selected node remains active while sheets open and close. Contextual sections include, as appropriate:

- Content / Component / Image
- Layout
- Typography
- Spacing
- Background
- Border and Effects
- Responsive
- Visibility
- Interactions
- More / identity / accessibility
- Delete block

Controls use larger fields, select controls, breakpoint cards, visibility rows and explicit Apply actions for touch use.

## Layers / Navigator

Layers is secondary, exposed through More. The sheet uses touch-friendly rows and retains the hierarchical `layerRows()` renderer. It exposes selection, collapse, lock, hide, duplicate and delete actions through the existing layer model, plus explicit Move up, Move down, Move into and Move out alternatives so touch users do not depend on drag and drop.

## Responsive breakpoint distinction

The physical editor surface and the edited breakpoint remain independent:

- Physical surface: mobile Builder UI / phone canvas.
- Edited breakpoint: Desktop, Tablet, or Mobile.

The active breakpoint is always shown in the Edit context and can be switched from the Responsive sheet. Node values continue to use the existing `responsive.overrides` model and inherited/reset behavior.

## Touch and accessibility improvements

- Large tap targets for navigation, rows, breakpoint cards, visibility controls and form fields.
- No hover-dependent mobile workflow.
- Accessible labels on top-bar actions and sheet close controls.
- Visible focus styles for buttons, inputs, selects and textareas.
- ESC handling remains available through the existing global keyboard path.
- Safe-area bottom padding is applied to sheet content and bottom navigation.
- Scrim closes sheets without losing the selected node.

## Verification performed

1. Local HTTP preview served from `0.0.0.0:4174`.
2. Mobile editor mode opened in the browser.
3. Confirmed desktop topbar and desktop side panels are hidden in mobile mode.
4. Opened Blocks sheet and verified search plus all seven categories.
5. Opened Components category and verified native Kohevo items.
6. Inserted Booking Calendar; canvas updated and the inserted node remained selected.
7. Opened contextual Edit sheet for Booking Calendar.
8. Confirmed Component, Layout, Spacing, Responsive, Visibility, More and Delete sections.
9. Opened Theme sheet and verified site-wide sections.
10. Opened More sheet and verified Layers, Page settings, SEO, History, Comments, Shortcuts and Help.
11. Opened Layers and verified hierarchy plus explicit movement alternatives.
12. Opened Preview and confirmed editing chrome is reduced while visitor-style canvas remains visible.
13. Ran JavaScript syntax and whitespace checks.
14. Confirmed existing node/state/history functions remain in the same `app.js` architecture.

## Known limitations

- This remains a standalone visual prototype; Save, SEO, comments and help actions are representative UI flows rather than backend persistence.
- Preview uses the prototype canvas rather than a separately rendered published URL.
- Touch drag-and-drop is represented by explicit movement alternatives in Layers; desktop drag behavior remains unchanged.
- Browser verification used the available narrow mobile-mode canvas in the sandbox browser; a physical-device test is still recommended before production UI adoption.

## Topbar navigation refinement

The five mobile editor actions now sit in a compact horizontal action row directly below the mobile context header. This preserves the full capability surface while removing the large bottom dock and returning the lower canvas edge to the page preview. Sheets still open as contextual overlays and retain their scroll, scrim, safe-area and close behavior.
