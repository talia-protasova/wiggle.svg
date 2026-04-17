# wiggle.svg

A small sandbox for experimenting with SVG animations.

Paste an SVG, select elements, tweak animation properties, and see the result instantly.  
The goal is to make SVG animation easier to explore and understand without digging through documentation.

## Status

Early MVP. Currently supports transform (translate, scale) and opacity animations with timing controls.
More properties coming next (rotate, fill, stroke)

## Features

- Paste or drag-and-drop an SVG file
- Click any element in the preview to select it
- Animate opacity with from/to keyframes
- Animate rotation with custom pivot point (transform-origin)
- Orbit mode — rotate an element around an external center point
- 3D rotation via rotateX / rotateY with perspective
- Animate stroke-dashoffset for drawing effects (path length auto-detected)
- Control duration, delay, easing, repeat, and direction
- Live preview with instant CSS `@keyframes` output
- Copy the generated CSS/SVG with one click


## Tech

- Svelte 5
- TypeScript
- Vite
