import { Component } from '../core/component';
import { FontOptions } from '../core/format';
import { Rect } from '../core/rect';
import { mergeDefaults } from '../core/util';

type FormatFn = (current: number, total: number) => string;

const Defaults = {
  PageCounterFormat: {
    fontFamily: 'Noto',
    fontSize: 10,
    fontStyle: 'bold',
  } as FontOptions,
  DisclaimerFormat: { fontFamily: 'Noto', fontSize: 6 } as FontOptions,
} as const;

interface DisclaimerFooterProps {
  disclaimerText: string;
  formatFn?: FormatFn;
  disclaimerFontFormat?: FontOptions;
  pageCounterFontFormat?: FontOptions;
  textGap?: number;
}

const DefaultFormatFn: FormatFn = (current, total) => `${current} / ${total}`;

export class DisclaimerFooter extends Component {
  private readonly pageFormatFn: FormatFn;
  private readonly disclaimerText: string;

  private disclaimerSpace?: number;

  private readonly pageCounterFormat: FontOptions;
  private readonly disclaimerTextFormat: FontOptions;
  private readonly textGap: number;

  constructor({
    disclaimerText,
    formatFn,
    disclaimerFontFormat,
    pageCounterFontFormat,
    textGap,
  }: DisclaimerFooterProps) {
    super();
    this.pageFormatFn = formatFn || DefaultFormatFn;
    this.disclaimerText = disclaimerText;
    this.pageCounterFormat = mergeDefaults(
      pageCounterFontFormat || {},
      Defaults.PageCounterFormat
    );
    this.disclaimerTextFormat = mergeDefaults(
      disclaimerFontFormat || {},
      Defaults.DisclaimerFormat
    );
    this.textGap = textGap || 0;
  }

  override evaluate(bounds: Rect): [boolean, number, Component?, Component?] {
    super.evaluate(bounds);

    const sampleFormattedText = this.pageFormatFn(10, 10);
    const pageCountSpace = this.getTextDimensions(sampleFormattedText, {
      ...this.pageCounterFormat,
    });
    this.disclaimerSpace = this.bounds.width - pageCountSpace.w - this.textGap;
    const disclaimerTextHeight = this.getMultilineTextHeight(
      this.disclaimerText,
      this.disclaimerSpace,
      this.disclaimerTextFormat
    );

    return [disclaimerTextHeight <= bounds.height, disclaimerTextHeight];
  }

  override render(): void {
    super.render();
    const ctx = this.assertPageContext();

    this.text(this.bounds.x, this.bounds.y, this.disclaimerText, {
      textOptions: {
        maxWidth: this.disclaimerSpace,
      },
      fontOptions: this.disclaimerTextFormat,
    });

    const pageText = this.pageFormatFn(ctx.pageNumber, ctx.totalPages);
    const pageTextDimen = this.getTextDimensions(pageText);
    this.text(
      this.bounds.BottomRight.x - pageTextDimen.w,
      this.bounds.BottomRight.y - pageTextDimen.h,
      pageText,
      {
        fontOptions: this.pageCounterFormat,
      }
    );
  }
}
