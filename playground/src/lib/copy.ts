import { articles, type PageId } from './routes';

interface Entry {
  title: string;
  tint: string;
  body: string;
  next: { href: PageId; label: string };
  variant?: 'long' | 'hero';
  image?: string;
}

const articleTitles: Record<(typeof articles)[number], [string, string]> = {
  harbour: ['Harbour light', '#e8f1ff'],
  ridge: ['Ridge line', '#e8f7ed'],
  tide: ['Low tide', '#f1eefb'],
  ember: ['Ember season', '#fff0e6'],
};

// Every article page: the image and the heading are on the overview too.
const articleCopy = Object.fromEntries(
  articles.map((article) => [
    `work/${article}`,
    {
      title: articleTitles[article][0],
      tint: articleTitles[article][1],
      body: 'An article page. Under Fade, Rise, Dip and Blur its image and heading come from the card on the overview, and return to it when you go back.',
      next: { href: 'work', label: 'All work' },
      image: `/work/${article}.svg`,
    },
  ]),
) as Record<`work/${(typeof articles)[number]}`, Entry>;

export const copy: Record<PageId, Entry> = {
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
    body: 'An overview. Under Fade, Rise, Dip and Blur an article’s image and heading are Shared elements: open one and they travel to their place on the article page.',
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
  ...articleCopy,
};
