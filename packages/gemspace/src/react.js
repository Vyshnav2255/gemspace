import { createElement } from 'react';
import { getGemSrc } from './core.js';

/** A plain image: no CSS import, network request, hooks, or global styles. */
export function Gem({ gem, variant = 'color', size = 64, alt, style, ...props }) {
  if (!Number.isFinite(size) || size <= 0) {
    throw new RangeError('Gem size must be a positive number of pixels.');
  }
  return createElement('img', {
    ...props,
    src: getGemSrc(gem, variant),
    alt: alt ?? `${gem.label} gemstone`,
    width: size,
    height: size,
    decoding: 'async',
    style: { objectFit: 'contain', ...style },
  });
}
