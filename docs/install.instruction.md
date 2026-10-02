# Add page transitions to a project

This is the path for **existing** dastro projects. It replaces the copied `src/sass/view-transition/` kit. Do not also mount `<ClientRouter />` — this package is native cross-document View Transitions only.

Follow every step in order.

---

## 1. Install the package

```bash
npm i github:gridonic/dastro-page-transitions#v0.3.1
```

Requires a Sass pipeline (every dastro project already has one). `dastro` and `astro` are optional peers.

---

## 2. Use the stylesheet

In `src/sass/styles.scss`, replace the local `@forward 'view-transition'` (or the commented equivalent) with:

```scss
@use 'dastro-page-transitions/styles';
```

Then delete `src/sass/view-transition/` and `src/sass/_view-transition.scss`.

Importing the package enables `@view-transition { navigation: auto }`. A site that does not want snapshots should not import it.

---

## 3. Pick a Preset (optional)

Fade runs when no Preset class is set. Pass one class through LayoutBase’s `bodyClass`:

```astro
<LayoutBase bodyClass="ui-sticky-footer text-md view-transition-slide">
```

| Class | Motion |
|---|---|
| _(omit)_ or `view-transition-fade` | Fade (default) |
| `view-transition-rise` | Old page fades out, new page fades in rising |
| `view-transition-dip` | Old page fades out fully, then the new page fades in |
| `view-transition-blur` | Old page blurs away, new page sharpens in |
| `view-transition-slide` | New page pushes the old one out |
| `view-transition-flip` | Old page turns away to edge-on, then the new page turns in |
| `view-transition-cover` | New page slides in over the old one |
| `view-transition-wipe` | New page is revealed by a moving edge |
| `view-transition-iris` | New page is revealed by a circle growing from the centre |
| `view-transition-split` | Old page opens from the middle outwards over the new page |
| `view-transition-cutout` | New page shows through a shape that grows from the centre |
| `view-transition-lines` | New page is revealed in bands, one after another |

Slide, flip, cover, wipe, split and lines start from an edge, their **Origin**. Add a second class to change it:

```astro
<LayoutBase bodyClass="ui-sticky-footer text-md view-transition-cover view-transition-from-left">
```

| Preset | Default | `view-transition-from-…` |
|---|---|---|
| slide | `right` | `top`, `right`, `bottom`, `left`: the edge the new page comes in from |
| flip | `right` | `left` or `right`: turns around the vertical axis. `top` or `bottom`: around the horizontal axis. |
| cover | `bottom` | `top`, `right`, `bottom`, `left`: the edge the new page comes in from |
| wipe | `bottom` | `top`, `right`, `bottom`, `left`: the edge the reveal starts from |
| split | `left` | `left` or `right`: opens sideways. `top` or `bottom`: opens up and down. |
| lines | `left` and `top` | `left` or `right`: the side each band starts from. `top` or `bottom`: the band that goes first. Takes one of each. |

### Cutout shape

`view-transition-cutout` uses a circle unless you give it a shape. Point `--view-transition-shape` at an SVG; its filled areas are where the new page shows through:

```scss
:root {
  --view-transition-shape: url('/logo-mark.svg');
}
```

Use a root-relative or absolute URL, and give the SVG a `viewBox`. A solid shape that is filled at its centre works best. A shape with holes, or one that is empty at its centre, never covers the screen, so the rest of the new page fades in over the last quarter of the transition.

### Blurred seam (optional)

Add `view-transition-edge-blur` to the body classes to blur the pages where they meet. It works with slide, cover, wipe and iris, and is strongest on the seam itself:

```astro
<LayoutBase bodyClass="ui-sticky-footer text-md view-transition-cover view-transition-edge-blur">
```

It uses `html::before`, `html::after` and `body::after` as its layers, so do not add it to a site that already uses those pseudo-elements. Tune it with `--view-transition-edge-blur` (default `8px`, the blur of each of the three layers) and `--view-transition-edge-width` (default `30vmax`, the width of the blurred band).

`view-transition-slide-up` no longer exists; use `view-transition-slide view-transition-from-bottom`.

Do not set a Sass `$preset`. These CSS variables on `:root` tune any Preset:

| Variable | Default | Effect |
|---|---|---|
| `--view-transition-duration` | `0.6s` | Base length. Every Preset's timings are fractions of it. |
| `--view-transition-ease` | _(unset)_ | Easing for both pages, replacing the Preset's own curves. Any easing function works, including `linear()`. |
| `--view-transition-old-ease`, `--view-transition-new-ease` | _(unset)_ | Easing for the outgoing or the incoming page only. Wins over `--view-transition-ease`. |
| `--view-transition-backdrop` | `transparent` | Colour behind the pages, seen in the gap of `dip`, `rise` and `blur`, around the old page in `cover` and around the turning page in `flip`. Transparent shows the incoming page's background. |
| `--view-transition-perspective` | `150vmax` | Viewing distance of `flip`. Smaller is a stronger 3D effect. |
| `--view-transition-blur` | `20px` | Blur radius of `blur`. |
| `--view-transition-feather` | `0px` | Width the edge of `wipe`, `iris` and `split` fades over. `0px` is a hard edge; try `20vh`. A feathered edge has no divider. |
| `--view-transition-divider` | `0px` | Width of a line along the edge between the pages in `slide`, `cover`, `wipe`, `iris`, `split`, `cutout` and `lines`. `0px` is no line. |
| `--view-transition-divider-color` | `currentColor` | Colour of that line. |

---

## 4. Keep the Frame classes

Projects already put these on header modules and the site bar. Leave them:

```html
<div class="header-hero ui-grid view-transition-header">
<header class="site-header view-transition-site-header">
```

The **Preset** decides what `.view-transition-header` does: under fade, rise, dip and blur it arrives a beat after the page; under the others it moves as part of the page. `.view-transition-site-header` does not animate.

---

## 5. Check reduced motion

`prefers-reduced-motion` skips the at-rule, so those users get a normal full page load. You do not need a project-level override.
