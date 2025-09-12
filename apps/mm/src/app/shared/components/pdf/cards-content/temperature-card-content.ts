import {
  CardConfigOptions,
  CardContent,
  ColumnLayout,
  Component,
  DEFAULT_DESC_OPTIONS,
  DEFAULT_TITLE_OPTIONS,
  FontOptions,
  Rect,
  SPACING,
  TextBlock,
} from '@schaeffler/pdf-generator';

export interface TemperatureCardContentOptions extends CardConfigOptions {
  valueFontOptions?: FontOptions;
  labelFontOptions?: FontOptions;
}

export class TemperatureCardContent extends CardContent {
  private readonly content: Component;
  protected calculatedHeight = 0;

  constructor(
    private readonly temperatures: {
      value: string;
      unit: string;
      label: string;
    }[],
    options: TemperatureCardContentOptions = {}
  ) {
    super(options);

    const valueFontOptions = options.valueFontOptions || {
      ...DEFAULT_TITLE_OPTIONS,
      fontSize: 12,
      fontStyle: 'bold',
    };
    const labelFontOptions = options.labelFontOptions || {
      ...DEFAULT_DESC_OPTIONS,
      fontSize: 9,
    };

    const temperatureComponents: Component[] = [];

    this.temperatures.forEach((temp) => {
      const valueText = `${temp.value} ${temp.unit}`;
      const valueBlock = new TextBlock(valueText, valueFontOptions);

      const labelBlock = new TextBlock(temp.label, labelFontOptions);

      const temperatureColumn = new ColumnLayout(
        [valueBlock, labelBlock],
        SPACING.TIGHT
      );

      temperatureComponents.push(temperatureColumn);
    });

    this.content = new ColumnLayout(temperatureComponents, SPACING.WIDE);
  }

  public override evaluate(bounds: Rect): [boolean, number] {
    super.evaluate(bounds);

    const contentBounds = new Rect(
      bounds.x + this.padding,
      bounds.y + this.padding,
      bounds.height - this.padding * 2,
      bounds.width - this.padding * 2
    );

    this.content.setDocument(this._pdfDoc);
    const [, height] = this.content.evaluate(contentBounds);

    this.calculatedHeight = height + this.padding * 2;

    return [true, this.calculatedHeight + this.margin];
  }

  public override render(): void {
    super.render();

    const contentBounds = new Rect(
      this.bounds.x + this.padding,
      this.bounds.y + this.padding,
      this.calculatedHeight - this.padding * 2,
      this.bounds.width - this.padding * 2
    );

    this.content.setBounds(contentBounds);
    this.content.render();
  }
}
