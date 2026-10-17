# Naga Prajwalith P — Portfolio

React + Vite + Tailwind, with components from Magic UI, Aceternity UI and React Bits, logos from Devicon.

## Run it

```bash
npm install      # first time only
npm run dev      # live-reloading dev server at http://localhost:5173
npm run build    # production build into dist/
```

## Edit content

Everything (projects, skills, education, links) lives in `src/data.ts`.

- **Your photo:** put it in `public/` (e.g. `public/me.jpg`) and set `PHOTO = './me.jpg'` in `src/data.ts`.
- **LinkedIn:** paste your profile URL into `PROFILE.linkedin`. It then appears in the dock and contact section.
- **Résumé:** replace `public/Naga-Prajwalith-P-Resume.pdf`.

## Deploy for free

Run `npm run build` and drag the `dist/` folder onto https://app.netlify.com/drop, or push this folder to GitHub and import it on Vercel.

## Features worth knowing

- **Experience visuals** (`src/sections/Experience.tsx`): an animated Medallion pipeline, a clickable
  lineage graph and a Teradata-to-Delta DDL demo (sample names only).
- **Command menu**: press `Ctrl K` (or the ⌘ dock button) to jump to sections, copy the email,
  download the résumé, switch theme or turn on lite mode.
- **Lite mode** (`src/lib/lite.ts`): swaps the WebGL aurora, 3D icon cloud, meteors and beams for static
  versions. Turns on automatically for reduced-motion users and very low-power devices.
- **Link previews**: `public/og-image.png` plus meta tags in `index.html`. After deploying, set
  `SITE_URL` in `vite.config.ts` to your live address so LinkedIn/WhatsApp can load the image.
