import { defineConfig } from 'astro/config';

export default defineConfig({
  devToolbar: { enabled: false },
  // The page being opened has to carry `@view-transition` when it first
  // renders. As a separate file the stylesheet sometimes arrives too late and
  // the browser skips the transition, so it is inlined into every page.
  build: { inlineStylesheets: 'always' },
  // Links end in a slash so a static host does not answer them with a redirect.
  trailingSlash: 'always',
});
