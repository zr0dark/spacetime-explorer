# Spacetime Explorer

A small, interactive exploration of gravity and time, built by [RocketShift](https://rocketshift.app). Rotate a three-dimensional lattice, follow orbiting bodies, and compare colored clocks near a central mass.

[Live demo](https://rocketshift.app/labs/spacetime/) · [Source](https://github.com/zr0dark/spacetime-explorer)

## Run it

A self-contained educational browser experience. Open `index.html` directly in a modern browser, or run `python3 -m http.server 8765` from this directory and visit http://localhost:8765. No libraries, trackers, network requests, API keys, installations, or build step are required. Share the single HTML file to run offline. The homepage link is optional; the simulation itself makes no network requests.

## Controls
Drag (touch or mouse) to orbit; scroll or use +/− to zoom. With canvas focused, arrow keys rotate. Pause freezes clocks and orbits; camera remains interactive. Reset returns the complete default state. Mass and preset changes restart the clocks; grid exaggeration and lattice brightness do not. Star Brightness spans 0–100%, adjusting surface illumination and halo intensity, never transparency; 0% shows an opaque, shaded planet-like sphere with no emitted glow. Its gravity and clock rates are unchanged. Reset restores 100%. The Lattice Brightness slider spans 0–500% and affects only the lattice, while the taller viewing area leaves explanations below for scrolling. Simulated time advances at 60 seconds per real second and pauses while the browser is hidden.

## Physics and visual boundaries
Static-clock lapse is exactly `sqrt(1-rs/r)` in Schwarzschild spacetime for an ideal nonrotating spherical central source, relative to a reference clock at infinity. Radius is measured in units of the central body's fixed radius R. Default compactness rs/R = 0.5; Sun-like = 0.00000424. Mass strength ranges 0.3–1.3. Thus even at maximum mass rs/R = 0.65 < 1, and all probes (1.45, 3, 5.6 R) remain outside the horizon and stellar surface. This is not an orbital-clock calculation.

The three-dimensional lattice is an explicitly illustrative deformation, not a numerical GR solution or literal material being pulled inward. Its appearance is not a physical distance metric. Orbiting planets have scripted circles, approximate Kepler-style relative periods, and qualitative local dents only. Their mass and velocity do not affect the calculated probe clocks. Coordinate/optical effects, light propagation delay, frame dragging, kinetic time dilation, and full multi-body spacetime are excluded. The central stellar radius and grid visual deformation remain distinct.

Far-away reference is represented only by a clock card, not a finite spatial marker. All three colored probes are held at fixed radii, not attached to planets. Seconds shown by each clock are local elapsed proper time under the stated model. Weak-field rates use six decimals to make the tiny difference explicit.

## Verification

The numerical check requires Node.js but no installed packages:

```sh
npm test
```

For optional Chromium browser checks (Node.js 18 or newer):

```sh
npm install
npx playwright install chromium
npm run test:browser
```

The browser check resolves this directory portably and creates desktop/mobile screenshots under `artifacts/` (ignored by Git). Package installation and browser download need internet access; neither is required to run the simulation. On Linux, Playwright may additionally need browser system dependencies (`npx playwright install --with-deps chromium`).

`node verify.mjs` checks the extracted real production clock-rate function and model domain. Browser smoke tests should verify canvas output, pointer/camera rotation, pause/resume, reset, presets, responsive controls, and no overflow on mobile. A physical WebGL engine is unnecessary: canvas uses perspective projection and does not require GPU library support.


## Contributing

Suggestions, accessibility improvements, and clearer educational explanations are welcome. Keep the distinction between calculated clock rates and illustrative graphics explicit. Please include numerical checks for model changes and browser checks for interaction/layout changes. This version does not implement a three-body solver or a camera that travels among the bodies.

## License

[MIT](LICENSE), copyright 2026 Jason Armstrong. You may reuse, modify, and distribute the code, including commercially, while retaining the copyright and license notice. The license includes no warranty. Attribution to RocketShift is appreciated; the license does not require a visible promotional link in your interface.
