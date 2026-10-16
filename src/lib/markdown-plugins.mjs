/**
 * Markdown (Sätteri) plugin for blog posts:
 *  - Links to other websites open in a new tab with rel="noopener".
 *  - Photos get several sizes (srcset) so phones download smaller files.
 */
const POST_IMAGE_WIDTHS = [480, 640, 800, 1200];
// The article column is about 700px wide on desktop; full width minus the page gutter on phones.
const POST_IMAGE_SIZES = '(min-width: 1024px) 700px, calc(100vw - 2.5rem)';

export function postContentPlugin() {
  return {
    name: 'painters-touch-post-content',
    element: {
      filter: ['a', 'img'],
      visit(node, ctx) {
        const props = node.properties ?? {};
        if (node.tagName === 'a') {
          const href = String(props.href ?? '');
          if (/^https?:\/\//.test(href) && !href.includes('painterstouch.site')) {
            ctx.setProperty(node, 'target', '_blank');
            ctx.setProperty(node, 'rel', 'noopener');
          }
          return;
        }
        // Images: these properties are handed to Astro's image service when it builds the photo.
        if (!('widths' in props)) ctx.setProperty(node, 'widths', POST_IMAGE_WIDTHS);
        if (!('sizes' in props)) ctx.setProperty(node, 'sizes', POST_IMAGE_SIZES);
      },
    },
  };
}
