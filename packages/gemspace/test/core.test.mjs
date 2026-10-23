import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import * as catalog from '../src/index.js';
import { getGemSrc, gemVariants, roseQuartz } from '../src/index.js';

test('all 12 gems and all 48 variants embed the normalized artwork exactly', () => {
  const gems = Object.values(catalog).filter(value => value && typeof value === 'object' && 'sources' in value);
  assert.equal(gems.length, 12);
  for (const gem of gems) for (const variant of gemVariants) {
    const src = getGemSrc(gem, variant);
    assert.ok(src.startsWith('data:image/svg+xml,'));
    const decoded = decodeURIComponent(src.slice('data:image/svg+xml,'.length));
    assert.equal(decoded, readFileSync(new URL(`../../../dist/assets/previews/${gem.name}-${variant}.svg`, import.meta.url), 'utf8'));
    assert.ok(!/https?:\/\//.test(decoded.replaceAll('http://www.w3.org/2000/svg', '')));
  }
});
test('default variant, invalid inputs and immutable assets', () => {
  assert.equal(getGemSrc(roseQuartz), roseQuartz.sources.color);
  assert.throws(() => getGemSrc(roseQuartz, 'unknown'), RangeError);
  assert.throws(() => getGemSrc('rose-quartz'), TypeError);
  assert.ok(Object.isFrozen(roseQuartz));
  assert.ok(Object.isFrozen(roseQuartz.sources));
});
test('per-gem modules are independent and contain no React dependency', () => {
  for (const file of readdirSync(new URL('../src/gems/', import.meta.url)).filter(f => f.endsWith('.js'))) {
    assert.ok(!readFileSync(new URL(`../src/gems/${file}`, import.meta.url), 'utf8').includes('import '));
  }
});
