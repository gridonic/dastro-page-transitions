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
The one site-wide animation for the root page swap and the page-header **Named group**. v1 names: fade, slide, slide-up. Default fade. Motion details are not locked.
*Avoid*: using this for site-header motion, treating a keyframe as the Preset

**Named group**:
A `view-transition-name` on the **Frame** that always participates. Projects attach it with the existing classes `.view-transition-header` (follows the **Preset**) and `.view-transition-site-header` (persist).
*Avoid*: optional toggle, per-page override, renaming those classes

**Frame**:
The site-header and page header modules that carry **Named groups**.
*Avoid*: chrome, layout, shell

## Relationships

- A **Page transition** is a full page load that the browser animates as a **View Transition**
- Importing the package enables `@view-transition { navigation: auto }`. Opting out is not using the package.
- This package does not ship ClientRouter and does not emit same-document swaps
- A site has exactly one **Preset**, chosen with a class on `body` (not in SCSS, not a component). If omitted, it is fade.
- The **Frame** always uses the same **Named groups**; the page header follows the **Preset**, the site-header always persists
- `prefers-reduced-motion` means no **Page transition** animation

## Example dialogue

> **Dev:** "Should we mount ClientRouter so the header can persist and scripts can listen to `astro:page-load`?"
> **Domain expert:** "No. Everstride is the reference: native cross-document **View Transition**, full page load. Scripts re-run on their own; we do not own SPA survival."

## Flagged ambiguities

- Existing dastro projects use "view transition" for the SCSS kit, ClientRouter, and the browser API at once — resolved: the kit is **Page transitions**; the browser API is **View Transition**; ClientRouter is out of scope.
- "Which preset in Sass?" — resolved: Sass ships every **Preset**; the layout picks one with a `body` class.
- The package is CSS-only — resolved: no Astro component; ClientRouter and a preset head component are both out.
- ClientRouter-only was locked then reversed — resolved: native CSS like everstride, not Astro SPA.
- Header fade vs slide — resolved: page header follows the **Preset**; site-header persists. Timing/keyframes are not locked.
- Preset `none` — resolved: not a Preset. Importing the package turns **View Transitions** on; a site that wants a plain load does not import it.
- Reduced-motion — resolved: no **Page transition** animation. Implementation should skip the at-rule so the browser does not snapshot either.
- Back-button reverse — resolved: never reverse. **Direction** is not a term. Preset motion will be iterated; names are the catalog, not the keyframes.
- "Chrome" collided with the browser — resolved: the site-header and page header are the **Frame**.
