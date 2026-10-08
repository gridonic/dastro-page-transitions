export const presets = [
  'fade',
  'rise',
  'dip',
  'blur',
  'slide',
  'flip',
  'cover',
  'wipe',
  'iris',
  'split',
  'cutout',
  'lines',
  'curtain',
] as const;
export const articles = ['harbour', 'ridge', 'tide', 'ember'] as const;
export const pages = [
  'home',
  'about',
  'work',
  'long',
  'hero',
  ...articles.map((article) => `work/${article}` as const),
];

export type PresetId = (typeof presets)[number];
export type PageId = (typeof pages)[number];

export const families = ['Fade', 'Push', 'Turn', 'Layered'] as const;
export type Family = (typeof families)[number];

export const presetInfo: Record<
  PresetId,
  { family: Family; motion: string; header: 'Staggered' | 'With the page' }
> = {
  fade: {
    family: 'Fade',
    motion: 'The old page fades out while the new page fades in on top of it.',
    header: 'Staggered',
  },
  rise: {
    family: 'Fade',
    motion: 'The old page fades out and drifts up. The new page fades in, rising into place.',
    header: 'Staggered',
  },
  dip: {
    family: 'Fade',
    motion: 'The old page fades out completely, then the new page fades in. The two are never visible together.',
    header: 'Staggered',
  },
  blur: {
    family: 'Fade',
    motion: 'The old page goes out of focus and disappears. The new page comes into focus.',
    header: 'Staggered',
  },
  slide: {
    family: 'Push',
    motion: 'The new page comes in from one edge and pushes the old page out of the other.',
    header: 'With the page',
  },
  flip: {
    family: 'Turn',
    motion: 'The old page turns around its own axis until it is edge-on, then the new page turns in to face you.',
    header: 'With the page',
  },
  cover: {
    family: 'Layered',
    motion: 'The new page slides in over the old page like a sheet, while the old page shrinks back and dims.',
    header: 'With the page',
  },
  wipe: {
    family: 'Layered',
    motion: 'An edge travels across the screen. Behind it is the new page, ahead of it the old one, and neither moves.',
    header: 'With the page',
  },
  iris: {
    family: 'Layered',
    motion: 'A circle opens at the centre and grows until the new page fills the screen.',
    header: 'With the page',
  },
  split: {
    family: 'Layered',
    motion: 'The old page opens along the middle like a pair of doors, revealing the new page behind it.',
    header: 'With the page',
  },
  cutout: {
    family: 'Layered',
    motion: 'A shape is cut out of the old page at the centre and grows, as if zooming through it into the new page.',
    header: 'With the page',
  },
  lines: {
    family: 'Layered',
    motion: 'The screen is cut into horizontal bands. Each band wipes to the new page, one after another, forming a staircase edge.',
    header: 'With the page',
  },
  curtain: {
    family: 'Layered',
    motion: 'A panel in one colour rises over the old page and covers the whole screen, the bar included. After a short hold it leaves through the opposite edge and the new page comes up behind it.',
    header: 'With the page',
  },
};

// The first direction is the Preset's default and is left out of the URL.
export const directions: Partial<Record<PresetId, readonly string[]>> = {
  slide: ['right', 'left', 'bottom', 'top'],
  flip: ['right', 'left', 'bottom', 'top'],
  cover: ['bottom', 'top', 'left', 'right'],
  wipe: ['bottom', 'top', 'left', 'right'],
  split: ['left', 'top'],
  lines: ['left-top', 'right-top', 'left-bottom', 'right-bottom'],
  curtain: ['bottom', 'top', 'left', 'right'],
};

export function directionsOf(preset: PresetId) {
  return directions[preset] ?? [];
}

export function presetClass(preset: PresetId, direction?: string) {
  const from = direction
    ? direction.split('-').map((edge) => `view-transition-from-${edge}`)
    : [];
  return [`view-transition-${preset}`, ...from].join(' ');
}

export function presetLabel(preset: PresetId) {
  const label = preset.replace('-', ' ');
  return label[0].toUpperCase() + label.slice(1);
}

export function directionLabel(preset: PresetId, direction: string) {
  if (preset === 'split') {
    return direction === 'left' ? 'Sideways' : 'Up and down';
  }
  return `From ${direction.replace('-', ', ')}`;
}

function segments(preset: PresetId, page: PageId, direction?: string) {
  const isDefault = !direction || direction === directionsOf(preset)[0];
  return [
    preset === 'fade' ? null : preset,
    isDefault ? null : `from-${direction}`,
    page === 'home' ? null : page,
  ].filter(Boolean);
}

export function pageHref(preset: PresetId, page: PageId, direction?: string) {
  const path = segments(preset, page, direction).join('/');
  return path ? `/${path}/` : '/';
}

export function staticPaths() {
  return presets.flatMap((preset) =>
    [undefined, ...directionsOf(preset).slice(1)].flatMap((direction) =>
      pages.map((page) => ({
        params: {
          slug: segments(preset, page, direction).join('/') || undefined,
        },
        props: { preset, page, direction: direction ?? directionsOf(preset)[0] },
      })),
    ),
  );
}
