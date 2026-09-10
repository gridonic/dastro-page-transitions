# Add page transitions to a project

This is the path for **existing** dastro projects. It replaces the copied `src/sass/view-transition/` kit. Do not also mount `<ClientRouter />` — this package is native cross-document View Transitions only.

Follow every step in order.

---

## 1. Install the package

```bash
npm i github:gridonic/dastro-page-transitions#v0.1.1
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
| `view-transition-slide` | Horizontal slide |
| `view-transition-slide-up` | Vertical slide |

Do not set a Sass `$preset`. Duration and easing are CSS variables on `:root` (`--view-transition-duration`, `--view-transition-ease`, plus `-fast` / `-slow`).

---

## 4. Keep the Frame classes

Projects already put these on header modules and the site bar. Leave them:

```html
<div class="header-hero ui-grid view-transition-header">
<header class="site-header view-transition-site-header">
```

`.view-transition-header` follows the **Preset**. `.view-transition-site-header` does not animate.

---

## 5. Check reduced motion

`prefers-reduced-motion` skips the at-rule, so those users get a normal full page load. You do not need a project-level override.
