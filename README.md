# dastro-page-transitions

Cross-document [View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) for dastro/Astro sites. Same path as everstride: a full page load, animated by `@view-transition { navigation: auto }`. Not Astro SPA, not `ClientRouter`.

## Install

See [docs/install.instruction.md](./docs/install.instruction.md).

```bash
npm i github:gridonic/dastro-page-transitions#v0.1.0
```

```scss
@use 'dastro-page-transitions/styles';
```

Fade is the default. Pick another **Preset** with a class on `body` (`view-transition-slide`, `view-transition-slide-up`). Chrome uses the existing classes `.view-transition-header` and `.view-transition-site-header`.

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
