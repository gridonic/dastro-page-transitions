# The Preset is a body class, not a Sass variable or a component

The stylesheet contains every Preset and selects on a class on `body`. Projects pass that class through LayoutBase’s existing `bodyClass`. There is no `<PageTransitions>` component: enablement is `@view-transition { navigation: auto }` in the CSS.

Narrowed by [0006](./0006-sites-narrow-the-stylesheet.md): a site may leave Presets out of the stylesheet. The Preset is still the body class.

A Sass `$preset` would tree-shake unused animations but forces a rebuild to switch (playground) and a second knob. Preset CSS is tiny. A head component that only stamps a data attribute would exist solely for the knob; `bodyClass` already reaches the document.
