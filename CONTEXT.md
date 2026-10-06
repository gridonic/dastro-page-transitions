# Page transitions

Animated navigations between pages in a dastro/Astro site. This package enables them and supplies the shared *frame* and presets.

## Language

**Page transition**:
An animated full-page navigation from one dastro page to another, started by the browser as a cross-document **View Transition**.
*Avoid*: ClientRouter, SPA swap, Astro `<ClientRouter />`

**View Transition**:
The browser API (snapshots, `::view-transition-*` pseudos) enabled by `@view-transition { navigation: auto }`.
*Avoid*: treating ClientRouter or an Astro component as what starts it

**Preset**:
The one site-wide animation for the root page swap and the page header. A bundle of custom properties (keyframes, durations, delays, easing, whether the page header is its own **Named group**). Names: fade, rise, dip, blur, slide, flip, cover, wipe, iris, split, cutout, lines. Default fade. Motion details are not locked.
*Avoid*: using this for site-header motion, treating a keyframe as the Preset

**Origin**:
The edge a **Preset** starts from, for the Presets that have one (slide, flip, cover, wipe, split, lines). A second class on `body`, `view-transition-from-top|right|bottom|left`, next to the Preset class. Fixed for the site; it never changes with the navigation.
*Avoid*: direction, reverse, a separate Preset per edge (slide-up)

**Named group**:
A `view-transition-name` on the **Frame**. Projects attach it with the existing classes `.view-transition-header` (the **Preset** decides whether it is its own group or part of the page) and `.view-transition-site-header` (persist).
*Avoid*: per-site toggle, per-page override, renaming those classes

**Frame**:
The site-header and page header modules that carry **Named groups**.
*Avoid*: chrome, layout, shell

## Relationships

- A **Page transition** is a full page load that the browser animates as a **View Transition**
- Importing the package enables `@view-transition { navigation: auto }`. Opting out is not using the package.
- This package does not ship ClientRouter and does not emit same-document swaps
- A site has exactly one **Preset**, chosen with a class on `body` (not in SCSS, not a component). If omitted, it is fade.
- The stylesheet ships every **Preset** unless the site narrows it with Sass `$presets`. That decides what ships, not which **Preset** runs.
- The **Frame** always uses the same classes; the **Preset** decides whether the page header is its own **Named group** or moves with the page, the site-header always persists
- A **Preset**'s timings are fractions of `--view-transition-duration`, so a site scales any Preset with that one variable
- `prefers-reduced-motion` means no **Page transition** animation

## Example dialogue

> **Dev:** "Should we mount ClientRouter so the header can persist and scripts can listen to `astro:page-load`?"
> **Domain expert:** "No. Everstride is the reference: native cross-document **View Transition**, full page load. Scripts re-run on their own; we do not own SPA survival."

## Flagged ambiguities

- Existing dastro projects use "view transition" for the SCSS kit, ClientRouter, and the browser API at once — resolved: the kit is **Page transitions**; the browser API is **View Transition**; ClientRouter is out of scope.
- "Which preset in Sass?" — resolved: the layout picks the **Preset** with a `body` class. Sass ships every **Preset** by default; `$presets` only leaves unused ones out.
- The package is CSS-only — resolved: no Astro component; ClientRouter and a preset head component are both out.
- ClientRouter-only was locked then reversed — resolved: native CSS like everstride, not Astro SPA.
- Header fade vs slide — resolved: the **Preset** owns the page header, either as its own staggered group or as part of the page; site-header persists. Timing/keyframes are not locked.
- Preset `none` — resolved: not a Preset. Importing the package turns **View Transitions** on; a site that wants a plain load does not import it.
- Reduced-motion — resolved: no **Page transition** animation. Implementation should skip the at-rule so the browser does not snapshot either.
- Back-button reverse — resolved: never reverse. **Direction** is not a term; the fixed edge a Preset starts from is its **Origin**.
- `slide-up` as its own Preset — resolved: removed. It is slide with the **Origin** bottom. Preset motion will be iterated; names are the catalog, not the keyframes.
- "Chrome" collided with the browser — resolved: the site-header and page header are the **Frame**.
