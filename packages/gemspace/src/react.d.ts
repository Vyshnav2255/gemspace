import type { ImgHTMLAttributes, ReactElement } from 'react';
import type { GemAsset, GemVariant } from './core.js';
export type GemProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height'> & {
  gem: GemAsset;
  variant?: GemVariant;
  size?: number;
};
export declare function Gem(props: GemProps): ReactElement;
