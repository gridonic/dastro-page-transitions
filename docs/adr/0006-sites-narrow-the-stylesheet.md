# A site can narrow the stylesheet to the Presets it uses

The stylesheet still contains every Preset by default, and the Preset is still a body class. A site that has settled on its Preset can leave the others out:

```scss
@use 'dastro-page-transitions/styles' with ($presets: slide, $edge-blur: false);
```

0002 kept everything in on the premise that Preset CSS is tiny. It is not: lines alone is more than half of the stylesheet, and on everstride the unused Presets were most of the render-blocking layout CSS. `$presets` is not the `$preset` that 0002 rejected. It does not pick the animation, it only decides which Presets the body class can pick from, so switching between the listed Presets still needs no rebuild and the playground keeps all of them.

One configurable entry instead of an export per Preset: the Presets share rules (the mask clock, the divider, the seam) that have to name exactly the Presets that ship, and only the stylesheet as a whole knows that list.
