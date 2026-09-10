# Native CSS View Transitions, not ClientRouter

Dastro projects today mix two starters: boilerplate and everstride enable native MPA via `@view-transition { navigation: auto }` with no ClientRouter; semi and gridonic-website mount Astro’s ClientRouter on top.

This package follows everstride: cross-document **View Transitions** only. It must emit `@view-transition { navigation: auto }` and must not ship `<ClientRouter />`.

ClientRouter is a different product (SPA DOM swap, `transition:persist`, `astro:page-load`, scripts that do not re-run). The visual CSS (`::view-transition-*`, **Named groups** on the **Frame**) can look the same, but swapping the router later rewrites the package. Native CSS is the one most dastro sites already have.
