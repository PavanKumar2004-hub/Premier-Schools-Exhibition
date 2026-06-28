# Premier Schools Exhibition Landing Page

A responsive landing page for the **Premier Schools Exhibition** assignment. The page is built as a static front-end project using plain HTML, CSS, and JavaScript. It focuses on matching the supplied design across desktop, laptop, tablet, and mobile breakpoints without depending on any build tool or framework.

## Project Overview

The landing page presents an education exhibition where parents can discover and compare schools in Gurugram. It includes:

- A hero slider with animated vertical image columns and enquiry forms
- Exhibition stats and participating school logo marquees
- School category cards
- Appointment/pre-schedule call-to-action
- “Must-Visit” carousel cards
- Footer with office, contact, and social information

The implementation is intentionally lightweight so it can be opened directly in a browser and reviewed easily.

## Additional Enhancements

This project includes a set of improvements made beyond the base assignment:

- Added keyboard navigation and accessible ARIA labels for slider controls
- Kept the hero slider responsive with touch swipe support and pause-on-hover behavior
- Included reduced-motion support for animations using `prefers-reduced-motion`
- Implemented continuous logo marquee animation with hover/focus pause
- Organized CSS into section files and responsive overrides for easier maintenance
- Added a visible skip link for keyboard users and screen-reader friendliness
- Built the project to run directly from the file system or a simple local server

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- WebP/SVG image assets
- Google Fonts: Montserrat

No bundler, package manager, CSS framework, or runtime dependency is required.

## Folder Structure

```text
premier-schools/
├── index.html
├── README.md
├── assets/
│   ├── appointments/
│   ├── banners/
│   ├── children/
│   ├── choose/
│   ├── icons/
│   ├── info/
│   ├── logo/
│   ├── schools/
│   └── visit/
├── css/
│   ├── style.css
│   ├── sections/
│   │   ├── base.css
│   │   ├── header.css
│   │   ├── hero.css
│   │   ├── stats.css
│   │   ├── schools.css
│   │   ├── choose.css
│   │   ├── appointment.css
│   │   ├── visit.css
│   │   └── footer.css
│   └── responsive/
│       └── breakpoints.css
└── js/
    └── index.js
```

## CSS Organization

`css/style.css` is used as the main stylesheet manifest. It imports the partial CSS files in the same order as the page sections appear in `index.html`.

```css
@import url("./sections/base.css");
@import url("./sections/header.css");
@import url("./sections/hero.css");
@import url("./sections/stats.css");
@import url("./sections/schools.css");
@import url("./sections/choose.css");
@import url("./sections/appointment.css");
@import url("./sections/visit.css");
@import url("./sections/footer.css");
@import url("./responsive/breakpoints.css");
```

This keeps the code easier to debug while preserving the original cascade. Section-specific styles live in `css/sections/`, and responsive overrides live in `css/responsive/breakpoints.css`.

## JavaScript Behavior

All JavaScript is in `js/index.js`.

It handles:

- Preventing demo form submissions from leaving the page
- Hero slider navigation with buttons, dots, keyboard arrows, and touch swipes
- Center-column hero image animation using JavaScript for the pause/restart effect
- Visit-section carousel navigation with responsive visible-card counts

The CSS handles the side-column animations, while JavaScript controls the center column so the motion matches the design more closely.

## Responsive Notes

The layout has been tuned for:

- Desktop and large laptop screens
- 1024px laptop/tablet-landscape views
- Tablet portrait screens
- Mobile widths from small phones to large phones

The responsive CSS is intentionally kept at the end of the cascade in `css/responsive/breakpoints.css`, because many layout fixes depend on overriding section defaults.

## How to Run

Because this is a static project, there are two simple options:

### Option 1: Open Directly

Open `index.html` in a browser.

### Option 2: Use a Local Server

If your editor has Live Server, run it from the project root.

Or use any simple local server, for example:

```bash
python3 -m http.server 5500
```

Then open:

```text
http://localhost:5500
```
or use live server extension in vscode to make it simple without any process required

## Development Notes

- Keep `css/style.css` as the import file only.
- Add section styles to the matching file inside `css/sections/`.
- Add breakpoint-specific fixes to `css/responsive/breakpoints.css`.
- Keep image paths relative to the CSS file where they are used.
- Avoid changing the order of imports unless the cascade is reviewed after the change.
- The forms are non-functional by design for the assignment preview.


## Author
Created as a front-end assignment project for a job application.

Pavan Kumar
Frontend Developer | Backend Developer | Full Stack Web Developer

GitHub: https://github.com/PavanKumar2004-hub
LinkedIn: https://www.linkedin.com/in/pavankumar200411/

Created as part of a front-end assignment project, demonstrating responsive design, modern UI development practices, and clean, maintainable code.
