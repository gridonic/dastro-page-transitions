# dastro-page-transitions

Cross-document [View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) for dastro/Astro sites. Same path as everstride: a full page load, animated by `@view-transition { navigation: auto }`. Not Astro SPA, not `ClientRouter`.

## Install

See [docs/install.instruction.md](./docs/install.instruction.md).

```bash
npm i github:gridonic/dastro-page-transitions#v0.3.3
```

```scss
@use 'dastro-page-transitions/styles';
```

That ships every **Preset**. A site that only uses some can leave the rest out:

```scss
@use 'dastro-page-transitions/styles' with ($presets: slide, $edge-blur: false);
```

Fade is the default. Pick another **Preset** with a class on `body`: `view-transition-rise`, `-dip`, `-blur`, `-slide`, `-flip`, `-cover`, `-wipe`, `-iris`, `-split`, `-cutout` or `-lines`. Slide, flip, cover, wipe, split and lines take an **Origin** as a second class: `view-transition-from-top`, `-right`, `-bottom` or `-left`. The **Frame** uses the existing classes `.view-transition-header` and `.view-transition-site-header`.

Under fade, rise, dip and blur an overview can hand an article's image and heading over to the article's page. Mark them on both pages as **Shared elements**: the class `view-transition-shared-image` or `view-transition-shared`, and the same name in `--view-transition-shared-name`.

## Docs

- [CONTEXT.md](./CONTEXT.md) — domain language
- [docs/adr/](./docs/adr/) — why it's shaped this way
- [docs/install.instruction.md](./docs/install.instruction.md) — adding it to a project

## Development

```bash
npm install
npm run dev
```

The playground is at `playground/`. Switch Presets from the bar; click between pages to see the **View Transition**.

## Releasing

```bash
npm run release
```

Follow the prompts. Then `git push` and `git push origin v<version>` (copied to the clipboard). `npm run release -- --dry-run` prints the same steps without writing.
