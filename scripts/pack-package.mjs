import { mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const output = fileURLToPath(new URL('../output/', import.meta.url));
mkdirSync(output, { recursive: true });
execFileSync('npm', ['pack', '--pack-destination', output], { cwd: new URL('../packages/gemspace/', import.meta.url), stdio: 'inherit' });
