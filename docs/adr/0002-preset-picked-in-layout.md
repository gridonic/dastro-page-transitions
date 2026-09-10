# The Preset is a body class, not a Sass variable or a component

The stylesheet contains every Preset and selects on a class on `body`. Projects pass that class through LayoutBase’s existing `bodyClass`. There is no `<PageTransitions>` component: enablement is `@view-transition { navigation: auto }` in the CSS.

A Sass `$preset` would tree-shake unused animations but forces a rebuild to switch (playground) and a second knob. Preset CSS is tiny. A head component that only stamps a data attribute would exist solely for the knob; `bodyClass` already reaches the document.
