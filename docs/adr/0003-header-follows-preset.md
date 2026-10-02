# The Preset decides whether the page header is its own group; site-header always persists

The page header is never a separately chosen animation. Each **Preset** sets `--view-transition-header-name`: `header` makes the page header its own **Named group**, which replays the Preset's keyframes a beat after the page; `none` leaves it in the root snapshot, so it moves as part of the page. The site-header stays `animation: none`.

This replaces "the page header always follows the Preset as its own group". That held while every Preset was a fade or a shift. Layered and push Presets (slide, cover, wipe, iris, lines) move the page as one surface, and a header that replays the motion separately detaches from the page it belongs to: a second sheet, a second clip edge, a hole in the incoming page. Hand-matched header keyframes would only approximate what being in the same snapshot gives for free.

The classes do not change. Under a Preset that sets `none`, `.view-transition-header` assigns no name.
