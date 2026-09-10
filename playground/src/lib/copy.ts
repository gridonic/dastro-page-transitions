import type { PageId } from './routes';

export const copy: Record<
  PageId,
  { title: string; tint: string; body: string; next: { href: PageId; label: string } }
> = {
  home: {
    title: 'Home',
    tint: '#f4efe6',
    body: 'Native cross-document View Transitions. The bar stays put; the header follows the Preset. Pick Fade, Slide, or Slide up, then go to another page.',
    next: { href: 'about', label: 'About this kit →' },
  },
  about: {
    title: 'About',
    tint: '#dce8f2',
    body: 'Importing the package turns View Transitions on. A site that wants a plain full page load does not import it. There is no ClientRouter.',
    next: { href: 'work', label: 'See the work →' },
  },
  work: {
    title: 'Work',
    tint: '#e4f0d8',
    body: 'Header modules use view-transition-header. The site bar uses view-transition-site-header and does not animate.',
    next: { href: 'home', label: 'Back home →' },
  },
};
