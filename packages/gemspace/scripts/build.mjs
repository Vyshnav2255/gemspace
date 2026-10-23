import { readFileSync, writeFileSync } from 'node:fs';
const gems = ['dewdrop','blue-spark','sea-glass','moonstone','amethyst','sunstone','rose-quartz','jade','aurora','starlight','prism','everlight'];
const source = new URL('../../../dist/assets/previews/', import.meta.url);
const output = new URL('../src/', import.meta.url);
const variants = ['outline', 'uncolored', 'color', 'glow'];
const exports = ["export { getGemSrc, gemVariants } from './core.js';"];
const declarations = ["export { getGemSrc, gemVariants } from './core.js';", "export type { GemAsset, GemName, GemVariant } from './core.js';"];
for (const name of gems) {
  const identifier = name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  const label = name.replaceAll('-', ' ').replace(/^./, c => c.toUpperCase());
  let bitmap;
  const sources = variants.map(variant => {
    const svg = readFileSync(new URL(`${name}-${variant}.svg`, source), 'utf8');
    if (!svg.includes('viewBox="0 0 600 760"')) throw new Error(`Unnormalized preview: ${name}-${variant}`);
    if (variant !== 'outline') bitmap ??= svg.match(/data:image\/png;base64,[^"]+/)?.[0];
    return [variant, svg];
  });
  if (!bitmap) throw new Error(`Missing artwork: ${name}`);
  const sourceExpressions = sources.map(([variant, svg]) => `${JSON.stringify(variant)}: 'data:image/svg+xml,' + encodeURIComponent(${svg.split(bitmap).map(part => JSON.stringify(part)).join(' + bitmap + ')})`).join(',');
  const module = `// Generated from Gemspace's normalized artwork.\nconst bitmap = ${JSON.stringify(bitmap)};\nexport const ${identifier} = Object.freeze({name:${JSON.stringify(name)},label:${JSON.stringify(label)},sources:Object.freeze({${sourceExpressions}})});\nexport default ${identifier};\n`;
  writeFileSync(new URL(`gems/${name}.js`, output), module);
  writeFileSync(new URL(`gems/${name}.d.ts`, output), `import type { GemAsset } from '../core.js';\nexport declare const ${identifier}: GemAsset;\nexport default ${identifier};\n`);
  exports.push(`export { ${identifier} } from './gems/${name}.js';`);
  declarations.push(`export { ${identifier} } from './gems/${name}.js';`);
}
writeFileSync(new URL('index.js', output), exports.join('\n') + '\n');
writeFileSync(new URL('index.d.ts', output), declarations.join('\n') + '\n');
console.log(`Generated ${gems.length} gem modules with ${variants.length} normalized styles each.`);
