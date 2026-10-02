# Add page transitions to a project

This is the path for **existing** dastro projects. It replaces the copied `src/sass/view-transition/` kit. Do not also mount `<ClientRouter />` — this package is native cross-document View Transitions only.

Follow every step in order.

---

## 1. Install the package

```bash
npm i github:gridonic/dastro-page-transitions#v0.2.0
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
| `view-transition-cover` | New page slides in over the old one |
| `view-transition-wipe` | New page is revealed by a moving edge |
| `view-transition-iris` | New page is revealed by a circle growing from the centre |
| `view-transition-lines` | New page is revealed in bands, one after another |

Slide, cover, wipe and lines start from an edge, their **Origin**. Add a second class to change it:

```astro
<LayoutBase bodyClass="ui-sticky-footer text-md view-transition-cover view-transition-from-left">
```

| Preset | Default | `view-transition-from-…` |
|---|---|---|
| slide | `right` | `top`, `right`, `bottom`, `left`: the edge the new page comes in from |
| cover | `bottom` | `top`, `right`, `bottom`, `left`: the edge the new page comes in from |
| wipe | `bottom` | `top`, `right`, `bottom`, `left`: the edge the reveal starts from |
| lines | `left` and `top` | `left` or `right`: the side each band starts from. `top` or `bottom`: the band that goes first. Takes one of each. |

`view-transition-slide-up` no longer exists; use `view-transition-slide view-transition-from-bottom`.

Do not set a Sass `$preset`. These CSS variables on `:root` tune any Preset:

| Variable | Default | Effect |
|---|---|---|
| `--view-transition-duration` | `0.6s` | Base length. Every Preset's timings are fractions of it. |
| `--view-transition-backdrop` | `transparent` | Colour behind the pages, seen in the gap of `dip`, `rise` and `blur` and around the old page in `cover`. Transparent shows the incoming page's background. |
| `--view-transition-blur` | `20px` | Blur radius of `blur`. |
| `--view-transition-feather` | `0px` | Width the edge of `wipe` and `iris` fades over. `0px` is a hard edge; try `20vh`. |

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
