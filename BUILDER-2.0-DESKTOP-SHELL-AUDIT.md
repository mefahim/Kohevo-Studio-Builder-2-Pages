# Builder 2.0 Desktop Shell Refinement Audit

## Scope

This phase applies the supplied desktop workspace brief to the existing standalone Kohevo Builder 2.0 prototype. The production PHP/backend, React production Builder, database, APIs, document state, node model, responsive model, Add system, Navigator, selection, insertion and history architecture were not replaced or modified.

## Desktop shell changes

The desktop workspace now keeps the left Add/Insert panel persistent at a restrained width of approximately 230–244px. The center canvas owns the remaining workspace. The permanent right grid column was removed from the desktop shell presentation; the Inspector is now absolutely positioned over the canvas as an elevated contextual panel.

The top editor bar is constrained to 56px and the canvas utility toolbar to 40px. Bottom Navigator/zoom controls remain available in a compact 38px footer. The existing Add catalog, category tabs, Search, Preview, Add, insertion and drag/drop paths remain in the left panel.

## Floating Inspector

The Inspector uses a 320–340px default width, with 300px minimum and 420px maximum intent, a dark elevated surface, subtle border, shadow, rounded corners, independent scroll content, fixed header/tabs/footer areas, and a fast slide/fade transition. It remains a presentation layer over the existing contextual Inspector state.

A compact **Inspector** workspace toggle was added to the desktop chrome. Hiding it applies the `inspector-hidden` shell state, removes the Inspector from interaction and lets the canvas occupy the available workspace. Showing it restores the same selected node, active tab, open group state, breakpoint and current values because no document or Inspector content state is destroyed.

## Selection and responsive behavior

Selection remains driven by the existing node/state model. Hero and added node contextual Inspectors continue to render through the existing `renderInspector` path. Desktop, Tablet and Mobile breakpoint buttons remain in the topbar and Inspector. When the Inspector is hidden, breakpoint changes still apply to the existing state; reopening displays the current context.

At mobile Builder widths/state, the desktop floating Inspector and toggle are explicitly disabled. The existing touch-first mobile canvas, compact mobile bar, bottom navigation and bottom-sheet Inspector remain the mobile presentation model.

## Browser verification

The local prototype was served on port 4174 and visually inspected in the sandbox browser. Verified:

- Persistent left Add panel remains visible.
- Center canvas gains the space previously reserved for the right column.
- Floating Inspector appears above the canvas with its own border and shadow.
- Inspector toggle changes to **Show Inspector** when hidden and **Hide Inspector** when shown.
- Canvas visibly expands while Inspector is hidden.
- Hero selection and Inspector title remain `Hero section` after hide/show.
- Inspector content, tabs, responsive controls and existing groups remain available.
- Desktop → Tablet → Mobile → Desktop breakpoint switching preserves the hidden/shown state and selected context.
- Existing Add, Sections, Elements, Components, Dynamic, Media, Templates and AI catalog controls remain in the persistent left panel.
- Existing Navigator, zoom and canvas controls remain present.
- JavaScript syntax and whitespace checks pass.

## Known limitations

The prototype does not implement production persistence, real backend publishing, server-backed SEO, or a production drag/drop data service. Inspector width is configured through CSS variables rather than a new complex docking/resizing system; the presentation remains intentionally simple and reversible.
