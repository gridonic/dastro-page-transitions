import type { PageId } from './routes';

export const copy: Record<
  PageId,
  {
    title: string;
    tint: string;
    body: string;
    next: { href: PageId; label: string };
    variant?: 'long' | 'hero';
  }
> = {
  home: {
    title: 'Page transitions',
    tint: '#faf9f7',
    body: 'Native cross-document View Transitions. The bar stays put; the Preset decides how the page and its header arrive. Pick a Preset, then go to another page.',
    next: { href: 'about', label: 'About this kit' },
  },
  about: {
    title: 'About the kit',
    tint: '#e8f1ff',
    body: 'Importing the package turns View Transitions on. A site that wants a plain full page load does not import it. There is no ClientRouter.',
    next: { href: 'work', label: 'See the work' },
  },
  work: {
    title: 'Selected work',
    tint: '#e8f7ed',
    body: 'Header modules use view-transition-header. The site bar uses view-transition-site-header and does not animate.',
    next: { href: 'long', label: 'A long page' },
  },
  long: {
    title: 'A long page',
    tint: '#fff2cf',
    body: 'A tall page. Scroll down and navigate from the middle to see how a Preset behaves away from the top.',
    next: { href: 'hero', label: 'A dark hero' },
    variant: 'long',
  },
  hero: {
    title: 'A dark hero',
    tint: '#181716',
    body: 'A dark page with a header that fills the viewport, like a site that opens on a full-screen hero.',
    next: { href: 'home', label: 'Back home' },
    variant: 'hero',
  },
};
