# Under curtain the site-header is part of the page

[0003](./0003-header-follows-preset.md) made the site-header persist under every **Preset**. Curtain is the exception. Its whole point is a moment where the screen is one colour: a panel covers the old page, holds, and uncovers the new one. A site-header that stays put as its own **Named group** would sit on top of that panel for the whole transition.

So the **Preset** bundle gets a second name next to `--view-transition-header-name`: `--view-transition-site-header-name`. Curtain sets it to `none`, which leaves the site-header in the root snapshot, where the panel covers it with the rest of the page. Every other Preset leaves it at `site-header`. The class does not change.

The panel is not an element. It is `--view-transition-backdrop` showing between an old page that is clipped away and a new page that is clipped in. That keeps the Preset to two keyframes and no pseudo-elements on the site, and it is why the site sets the curtain's colour with the backdrop variable rather than a variable of its own.

Lifting the panel above a persistent site-header was the alternative. It needs a layer of its own, like the edge blur's, and claims a pseudo-element on every site that uses the Preset.
