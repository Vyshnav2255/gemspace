export const gemVariants = Object.freeze(['outline', 'uncolored', 'color', 'glow']);

/** Returns a self-contained image source. Works in browsers and during SSR. */
export function getGemSrc(gem, variant = 'color') {
  if (!gem || typeof gem.name !== 'string' || !gem.sources) {
    throw new TypeError('Pass an imported Gemspace gem, such as roseQuartz.');
  }
  if (!gemVariants.includes(variant)) {
    throw new RangeError(`Unknown gem variant "${variant}". Choose: ${gemVariants.join(', ')}.`);
  }
  return gem.sources[variant];
}
