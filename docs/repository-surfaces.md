# Repository surfaces

PIP applies to README covers, release notes, and repository diagrams as well as product screens. GitHub owns the page typography and layout; adapt the identity within those constraints instead of embedding an entire landing page as an image.

## Cover contract

- Use paper/ink for light surfaces and carbon/chalk for dark surfaces, from `packages/tokens/src/theme.css`
- Choose one accent protagonist: a kiwi headline **or** a signal field. Use deep kiwi text on paper and signal text on carbon; never white text on the signal field
- Lead with one short editorial headline. Mono labels identify the repository or category; keep important setup and status information in real Markdown below
- Keep most of the composition neutral, with alignment and spacing before boxes, gradients, or repeated badges
- Use a self-contained SVG with a `viewBox`, title/description, and local assets. No remote fonts, scripts, animation, or externally fetched brand dependencies
- Provide light/dark assets through a GitHub `<picture>` element when the artwork needs separate values. Include a light fallback and useful alt text
- At a 320px rendered width, the main headline must remain readable and within the canvas. Do not put installation instructions or the only version/status information inside artwork
- A repository illustration is static. Avoid button-shaped fake controls and arrows that imply interactions the image does not provide

## Content hierarchy

Cover → one-sentence purpose → real navigation → choose an outcome → install → examples → verification/maintenance. Badges belong with evidence such as CI status; a green badge is not proof of safety or an official marketplace listing.

Keep published, candidate, and unverified claims separate. Consumers record the PIP source revision used for their artwork and recheck actual foreground/background pairs whenever those values change.

## Review

Check light and dark presentation, headline width at desktop and mobile, alt text, relative links, and source attribution. SVG checks complement rendered inspection; they do not prove readability, keyboard accessibility of the host page, or WCAG conformance for the entire repository.
