# The page swap runs on the main thread

Chrome runs an animation of `opacity`, `transform` and, with GPU compositing, `clip-path` on the compositor. When such an animation ends, the compositor returns the layer to the values the main thread last committed. If the main thread is a frame late, because the new page is busy at that moment, the new page's layer is back at its start for that frame: clipped shut or see-through. The old page shows through it, or is back at full opacity itself, and the user sees one frame of the page they just left. It showed on residence-immobilien under unveil and fade, every few navigations, and never in headless Chrome, which runs `clip-path` on the main thread.

So every keyframe of the page swap also animates `--view-transition-main-thread`, a custom property with no effect. An animation with a custom property cannot run on the compositor, so both pages run on the main thread and end in the same frame. `reveal` (wipe, iris, split, cutout, lines) animates a registered custom property and was never affected.

The cost is smoothness: on the main thread a long task on the new page can drop frames of the transition itself. A dropped frame in the middle of a movement is less visible than the page that was left showing up again at its end, so it is the default. `$main-thread: false` turns it off for a site that prefers the compositor.

Rejected: aligning the timing of the two pages (they already ended in the same millisecond), ending the old page earlier (it then leaves an empty frame instead of an old one), and skipping the transition when a page is restored from the back/forward cache (the user then sometimes gets no animation at all).
