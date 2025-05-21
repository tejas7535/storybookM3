import { Colors, FontOptions, Rect } from '@schaeffler/pdf-generator';

import { CardBaseComponent } from '../base-components/base-component';

export interface CardConfigOptions {
  backgroundColor?: string;
  padding?: number;
  margin?: number;
}

export const SPACING = {
  NONE: 0,
  TIGHT: 2,
  STANDARD: 4,
  MEDIUM: 6,
  WIDE: 8,
};

export const FONT_SIZES = {
  SMALL: 8,
  MEDIUM: 10,
  LARGE: 12,
};

export const DEFAULT_TITLE_OPTIONS: FontOptions = {
  fontSize: FONT_SIZES.SMALL,
  fontStyle: 'normal',
  fontFamily: 'Noto',
};

export const DEFAULT_DESC_OPTIONS: FontOptions = {
  fontSize: FONT_SIZES.SMALL,
};

export const DEFAULT_LINK_OPTIONS: FontOptions = {
  fontSize: FONT_SIZES.SMALL,
  fontFamily: 'Noto',
};

export class CardContent extends CardBaseComponent {
  constructor(protected readonly config: CardConfigOptions = {}) {
    super();
    this.backgroundColor = config.backgroundColor || Colors.Surface;
    this.padding = config.padding ?? SPACING.STANDARD;
    this.margin = config.margin ?? SPACING.NONE;
  }

  public override evaluate(bounds: Rect): [boolean, number] {
    super.evaluate(bounds);

    return [true, 0]; // Placeholder, to be overridden by subclasses
  }

  public override render(): void {
    super.render();
    this.renderBackground();
  }
}
