# Importing the package always enables View Transitions

`@view-transition { navigation: auto }` ships in the stylesheet. There is no `none` Preset and no second “enable” export.

`none` only made sense as ClientRouter-without-motion. With native CSS, a site that does not want snapshots simply does not import the package. A body class cannot turn the at-rule off anyway, and splitting enablement from styles would be two knobs for something the import already means.
