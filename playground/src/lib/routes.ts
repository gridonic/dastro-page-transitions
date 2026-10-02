export const presets = [
  'fade',
  'rise',
  'dip',
  'blur',
  'slide',
  'cover',
  'wipe',
  'iris',
  'lines',
] as const;
export const pages = ['home', 'about', 'work', 'long', 'hero'] as const;

export type PresetId = (typeof presets)[number];
export type PageId = (typeof pages)[number];

export const families = ['Fade', 'Push', 'Layered'] as const;
export type Family = (typeof families)[number];

export const presetInfo: Record<
  PresetId,
  { family: Family; motion: string; header: 'Staggered' | 'With the page' }
> = {
  fade: {
    family: 'Fade',
    motion: 'The pages cross-fade.',
    header: 'Staggered',
  },
  rise: {
    family: 'Fade',
    motion: 'The old page fades out, the new page fades in rising.',
    header: 'Staggered',
  },
  dip: {
    family: 'Fade',
    motion: 'The old page fades out fully, then the new page fades in.',
    header: 'Staggered',
  },
  blur: {
    family: 'Fade',
    motion: 'The old page blurs away, the new page sharpens in.',
    header: 'Staggered',
  },
  slide: {
    family: 'Push',
    motion: 'The new page pushes the old one out.',
    header: 'With the page',
  },
  cover: {
    family: 'Layered',
    motion: 'The new page slides up over the old one, which recedes.',
    header: 'With the page',
  },
  wipe: {
    family: 'Layered',
    motion: 'An edge moving bottom to top reveals the new page.',
    header: 'With the page',
  },
  iris: {
    family: 'Layered',
    motion: 'A circle growing from the centre reveals the new page.',
    header: 'With the page',
  },
  lines: {
    family: 'Layered',
    motion: 'Bands reveal the new page left to right, top to bottom.',
    header: 'With the page',
  },
};

// The first direction is the Preset's default and is left out of the URL.
export const directions: Partial<Record<PresetId, readonly string[]>> = {
  slide: ['right', 'left', 'bottom', 'top'],
  cover: ['bottom', 'top', 'left', 'right'],
  wipe: ['bottom', 'top', 'left', 'right'],
  lines: ['left-top', 'right-top', 'left-bottom', 'right-bottom'],
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

export function directionLabel(direction: string) {
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
  return `/${segments(preset, page, direction).join('/')}`;
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
