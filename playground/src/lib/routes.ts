export const presets = ['fade', 'slide', 'slide-up'] as const;
export const pages = ['home', 'about', 'work'] as const;

export type PresetId = (typeof presets)[number];
export type PageId = (typeof pages)[number];

export function presetClass(preset: PresetId) {
  if (preset === 'slide') {
    return 'view-transition-slide';
  }
  if (preset === 'slide-up') {
    return 'view-transition-slide-up';
  }
  return undefined;
}

export function pageHref(preset: PresetId, page: PageId) {
  const presetSegment = preset === 'fade' ? '' : `/${preset}`;
  const pageSegment = page === 'home' ? '' : `/${page}`;
  return `${presetSegment}${pageSegment}` || '/';
}

export function staticPaths() {
  return presets.flatMap((preset) =>
    pages.map((page) => {
      const segments = [
        preset === 'fade' ? null : preset,
        page === 'home' ? null : page,
      ].filter(Boolean);
      return {
        params: { slug: segments.join('/') || undefined },
        props: { preset, page },
      };
    }),
  );
}
