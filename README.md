# Kohevo Studio — Builder 2.0 Prototype

Standalone visual UX prototype for the **Desktop Main Builder** screen. This is intentionally separate from the existing PHP/React production builder and does not call Kohevo APIs, touch database logic, or modify backend architecture.

## Run locally

```bash
cd 01-client/plugins/studio-builder/prototype
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Included

- Obsidian studio chrome with violet interaction signal
- Add panel with Elements, Sections, Components and utility destinations
- Canvas-first homepage preview with selectable hero section
- Selection outline, contextual toolbar, breadcrumbs and insertion indicator
- Style / Content / Advanced inspector tabs
- Image, color, gradient and video background modes
- Live overlay opacity, fit, position, focal point, min-height and responsive viewport controls
- Duplicate, delete, zoom, device switcher, keyboard shortcuts, and saved/publish feedback
- Desktop / tablet / mobile viewport modes without resizing the entire application shell

## Scope

This is a UX prototype only. It uses demo imagery from Unsplash for the canvas preview and makes no production backend or database changes.
