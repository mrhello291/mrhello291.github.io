# Asif's Neural Tree portfolio

A buildless static site: HTML, CSS, JavaScript and eight illustrated environment plates. No server API, framework, installation or 3D runtime is needed.

## Run locally

From this folder:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. The site uses hash routes, so it can also be served from a subfolder on any static host without rewrite rules.

## Fill in your information

Edit `content.js`. All profile fields, featured items, journey entries, categories and work entries live there. Bracketed values are placeholders; the name and GitHub handle follow the approved design. Empty email and link fields are hidden. Additional social links go in `profile.socials`.

The sample `PORTFOLIO.entries` assignment currently creates one ongoing and two past entries per category. To add real information, replace that assignment with your own array:

```js
PORTFOLIO.entries = [
  {
    id: 'my-first-project', // unique, stable id
    category: 'research', // jobs, competitions, research, side-quests, open-source, fun-projects
    status: 'ongoing', // or past
    title: 'Your project title',
    summary: 'A short description for the listing.',
    tags: ['Topic', 'Method'],
    date: 'Your dates',
    details: {
      'Research question': 'The question you are investigating.',
      'Method': 'Your approach.',
      'Findings': 'What you learned.',
      'Limitations': 'What remains uncertain.'
    },
    links: [{ label: 'Code', url: 'https://github.com/your/repository' }]
  }
];
```

Every details key becomes a section in the reading panel. This lets you tailor each entry without modifying the page renderer. Entries are displayed in array order within their status group. Add any number; empty sections show a gentle empty state. Text is escaped before rendering, and external links accept only HTTP, HTTPS and mailto URLs.

## Experience

- Homepage with scholar background, quick profile, highlights and map entry.
- Neural Tree with six keyboard-accessible destinations and illuminated routes on hover/focus.
- 2.5D backgrounds: each plate is drawn as two WebGL layers displaced by depth (a back layer with pop-out objects removed, and those objects cut out in front), with mouse parallax. Choosing a place on the Neural Tree flies the camera toward that landmark and crossfades into the destination; going back plays the flight in reverse. Without WebGL2 or with reduced motion, the flat images are used.
- Six category layouts with ongoing and past work; each entry opens a native dialog reading panel.
- About page with a journey timeline; contact page and social links.
- Browser back/forward, direct hash routes and remembered page scroll positions.
- Mobile destination grid, responsive reading panels, keyboard focus handling, skip link, system reduced motion and a persistent motion toggle.

## Files

- `index.html`: application shell
- `world.css`: layouts, theme, responsive rules and animation
- `world.js`: navigation, rendering, entry dialogs and motion
- `depth.js`: 2.5D depth renderer; tune depth, parallax and flight time in its `SETTINGS` block
- `content.js`: editable content
- `assets/*.webp`: scene artwork loaded by the site (re-export from the `*.png` masters with `cwebp -q 82 -m 6 -sharp_yuv NAME.png -o NAME.webp`)
- `assets/depth/`: per plate, `NAME.png` (R = front depth, G = back depth, white = near), `NAME-mask.png` (front cut-out) and `NAME-back.webp` (plate with the front objects removed), made with `tools/make-layers.py`
- `assets/og-image.jpg`: 1200×630 link-preview card (cropped from `tree.png`)
- `assets/PROMPTS.md`: image-generation specification and provenance
- `legacy/`: preserved earlier website implementation

## Artwork

The eight clean background plates were prepared using the built-in image-generation tool from the approved concept images. Real page text and navigation are HTML, not text baked into pictures. Google Fonts supplies Space Grotesk and IBM Plex Mono; system fallbacks keep the site usable if fonts are unavailable.

## Skills and automatic updates

Open `#/skills` from the navigation or the Neural Tree's glowing core. There is
no separate project database for this page: it derives every connection from
`PORTFOLIO.entries` in the six work categories.

1. Define categories in `PORTFOLIO.skillCategories`.
2. Define each skill once in `PORTFOLIO.skills`, with an id, name, and one category.
3. Add `skillIds: ['fastapi', 'docker']` to a work entry.
4. Reload the site after saving. The skill list, radar, ongoing/past counts and
   linked work update automatically. No manual chart values or reverse links.

Only skills linked to existing entries in the six work paths are shown. Removing
the last connection removes a skill from the page. Unknown skill ids are ignored;
repeated ids in one entry are counted once. Domain counts deduplicate entries
using several skills in that domain. The radar shows **distinct linked work
entries**, not an automatically inferred proficiency rating.

The initial data is illustrative and marked DEMO DATA. Replace the sample
skill catalog as needed, remove the `sampleSkillLinks` demo assignment block,
put `skillIds` directly on your real entries, and set `PORTFOLIO.skillsDemo=false`.
Updates happen from the local content file on page load/navigation; this is not
a GitHub sync or background fetch. `skills.js` contains the derivation logic.

### Tools are separate from skills

The radar has seven skill domains; Tools is not a domain. `PORTFOLIO.tools`
is a separate catalog, with `id`, `name`, and `skillIds` (multiple skills allowed).
Work entries have independent `skillIds` and `toolIds` arrays, for example:

```js
// Skill catalog: { id: 'apis', name: 'API development', category: 'backend' }
// Tool catalog: { id: 'docker', name: 'Docker', skillIds: ['apis', 'deployment'] }
// On a work entry:
skillIds: ['apis', 'deployment'],
toolIds: ['docker', 'git']
```

The Tools I use section derives its work links from `toolIds`. A tool's skill link
is displayed only if at least one of those same work entries also lists that
skill. Merely listing a tool never creates skill evidence or increases the radar.
Tool cards can show multiple skill links and expand to show connected work.
Project reading panels show a separate Tools used section.

Remove BOTH `sampleSkillLinks` and `sampleToolLinks` demo assignments when you
replace the generated entries with real ones. The initial named skills and tools
remain demo data. Run `node check-skills.cjs` in this folder to validate the linking
rules, including shared-work evidence and independence of tool and radar counts.


## Depth layers

The 2.5D backgrounds need three files per plate in `assets/depth/`. Depth comes from
Depth Anything V2 Base (ONNX, `onnx-community/depth-anything-v2-base`, CC BY-NC 4.0) on the CPU.
`tools/make-layers.py` then finds objects that pop out of their surroundings, cuts them out
along the painting's own edges, and fills the gap behind them. After changing a plate:

```sh
python3 -m venv .venv && .venv/bin/pip install onnxruntime numpy pillow
# download onnx/model.onnx from the Hugging Face repo above, then:
.venv/bin/python tools/make-layers.py model.onnx assets assets/depth .depth-cache home tree
```

Tune `THRESHOLD` (how far something must pop out to be cut out) at the top of the script.
`lab/depth.html` (not committed) is an older single-layer sandbox for the camera settings.
