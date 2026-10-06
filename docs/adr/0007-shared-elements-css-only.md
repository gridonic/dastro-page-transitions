# Shared elements stay CSS-only and work under the fade Presets only

A **Shared element** needs the same `view-transition-name` on both pages. The site writes that name itself, one per article and element, in `--view-transition-shared-name`; the package turns it into the **Named group** and supplies the motion. There is no script and no component.

CSS cannot tell which link is being followed, and the page being opened cannot tell where the visitor came from. So the names are permanent: every card on an overview is its own group in every navigation from or to that page, whether or not the other page has a counterpart. A group without one is cut out of its page's snapshot and can only replay the **Preset** by itself. Under fade, rise, dip and blur that is the same as being part of the page. Under slide each card would travel its own width, under cover and flip it would not shrink or turn with the page, and under the masked Presets it would sit unmasked on top: the detached header of [0003](./0003-header-follows-preset.md), once per card. Under those Presets the package sets the name to `none` and nothing is shared.

A script was built and rejected. In `pageswap` and `pagereveal` it named only the elements of the article the navigation was about, which works under every Preset. It would have been the first script and the first component in the package, it has to be inlined in the head to run before the first render, and it depends on `pageswap`'s `activation`. Sites that want Shared elements under slide or a layered Preset are the reason to revisit this.

Consequences the site carries:

- Names must be unique on a page. The same article twice on one page, with the same name, makes the browser skip the whole **View Transition**.
- An overview captures one snapshot per Shared element on every navigation.
- Groups that only the new page has are stacked above everything the old page had. The package lifts the site-header above them; a site with other fixed **Named groups** has to do the same.
