export type GemVariant = 'outline' | 'uncolored' | 'color' | 'glow';
export type GemName = 'dewdrop' | 'blue-spark' | 'sea-glass' | 'moonstone' | 'amethyst' | 'sunstone' | 'rose-quartz' | 'jade' | 'aurora' | 'starlight' | 'prism' | 'everlight';
export interface GemAsset {
  readonly name: GemName;
  readonly label: string;
  readonly sources: Readonly<Record<GemVariant, string>>;
}
export declare const gemVariants: readonly GemVariant[];
export declare function getGemSrc(gem: GemAsset, variant?: GemVariant): string;
