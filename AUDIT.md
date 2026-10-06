# Builder 2.0 Audit & Upgrade

## Audit findings

The first prototype had a polished shell but several controls were visual-only: undo/redo, Style/Content/Advanced tabs, grid/comments, media/color actions, duplicate/delete, palette insertion, and inline text editing. At narrow viewport widths it removed both desktop panels and left only the canvas, which was not a usable mobile editing experience.

## Upgrade decisions

- Added a lightweight history stack with undo/redo and keyboard shortcuts (`Cmd/Ctrl+Z`, `Shift+Cmd/Ctrl+Z`, `Cmd/Ctrl+S`).
- Added real canvas selection state, node insertion, duplicate/delete, navigator, grid/comments state, inline editing, and live style/content updates.
- Made Style, Content, and Advanced inspector tabs render useful controls rather than “coming next” feedback.
- Added a distinct Mobile Builder mode when the mobile device is selected: mobile mode bar, responsive canvas, bottom dock, Add drawer, Layers drawer, Quick Inspector drawer, mobile-only visibility/breakpoint context, and mobile element insertion. The desktop panels are replaced by purpose-built mobile controls instead of merely hidden.
- Kept the prototype frontend-only; no backend, database, or production architecture was changed.
