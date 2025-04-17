import { Component } from '../../core';
import { FontOptions, Paddings } from '../../core/format';
import { Rect } from '../../core/rect';
import { mergeDefaults } from '../../core/util';

interface Style {
  background?: string | [string, string];
  fontStyle: FontOptions | FontOptions[];
  cellSpacing?: Paddings;
}

interface Props {
  style?: Partial<Style>;
  data: string[][];
  headers?: string[][];
  columnTemplates?: string[];
}

const DefaultStyles: Style = {
  fontStyle: {
    fontFamily: 'Noto',
    fontSize: 10,
    fontStyle: 'normal',
  },
  cellSpacing: {
    top: 3,
    bottom: 2,
    left: 2,
    right: 2,
  },
};

export class Table extends Component {
  private readonly background: Style['background'] = '';
  private readonly data: string[][];

  private readonly headers?: string[][];

  private columnWidths?: number[] | number;
  private readonly columns: number = 0;
  private readonly columnTemplates?: string[];
  private readonly fontStyles: FontOptions | FontOptions[];

  private readonly rowConfigurations: { height: number; cells: string[] }[] =
    [];
  private readonly style: Style;
  private readonly cellSpacing: Paddings;

  constructor({ style, data, headers, columnTemplates }: Props) {
    super();
    this.style = mergeDefaults(style, DefaultStyles);
    this.columnTemplates = columnTemplates;
    this.background = style?.background || '';
    this.data = data;
    this.cellSpacing = mergeDefaults(
      style?.cellSpacing,
      DefaultStyles.cellSpacing
    )!;

    if (data.length > 0) {
      this.columns = this.data[0].length;
    }
    this.headers = headers;

    this.fontStyles = style?.fontStyle || DefaultStyles.fontStyle;
  }

  public override evaluate(
    bounds: Rect
  ): [boolean, number, Component?, Component?] {
    super.evaluate(bounds);

    if (this.columnTemplates) {
      // Parse percentages
      const percentages = this.parseColumnPercentages(this.columnTemplates);
      this.columnWidths = percentages.map(
        (percentage) => this.bounds.width * percentage
      );
    } else {
      this.columnWidths = this.bounds.width / this.columns;
    }

    let totalHeight = 0;

    const fittingData: string[][] = [];
    const remainderData: string[][] = [];

    [...this.data].map((row) => {
      const rowHeights = row.map((item, idx) =>
        this.getMultilineTextHeight(
          item,
          this.getColumnWidth(idx),
          this.getFontStyle(idx)
        )
      );
      const heighest = Math.max(...rowHeights);

      this.rowConfigurations.push({ height: heighest, cells: row });
      totalHeight += heighest + this.cellSpacing.bottom + this.cellSpacing.top;
      if (totalHeight <= this.bounds.height) {
        fittingData.push(row);
      } else {
        remainderData.push(row);
      }

      return heighest;
    });

    const fits = totalHeight <= this.bounds.height;
    if (fits) {
      return [true, totalHeight];
    }
    const fittingComponent = this.makeClone(fittingData);
    const overflowComponent = this.makeClone(remainderData);

    return [false, this.bounds.height, fittingComponent, overflowComponent];
  }

  public override render(): void {
    super.render();
    const doc = this.assertDoc();

    let ycursor = this.bounds.y;
    for (const [rowIdx, row] of this.rowConfigurations.entries()) {
      let xcursor = this.bounds.x;
      const backgroundColor = this.getBackgroundColor(rowIdx);
      doc.setFillColor(backgroundColor);
      doc.rect(
        xcursor,
        ycursor,
        this.bounds.width,
        row.height + this.cellSpacing.top + this.cellSpacing.bottom,
        'F'
      );

      for (const [cidx, cell] of row.cells.entries()) {
        const cellwidth = this.getColumnWidth(cidx);
        this.text(
          xcursor + this.cellSpacing.left,
          ycursor + this.cellSpacing.top,
          cell,
          {
            textOptions: {
              maxWidth:
                cellwidth - this.cellSpacing.left - this.cellSpacing.right,
            },
            fontOptions: this.getFontStyle(cidx),
          }
        );
        xcursor += cellwidth;
      }
      ycursor += row.height + this.cellSpacing.top + this.cellSpacing.bottom;
    }
  }

  private makeClone(data: string[][]) {
    return data.length === 0
      ? undefined
      : new Table({
          style: this.style,
          data,
          headers: this.headers,
          columnTemplates: this.columnTemplates,
        });
  }

  private parseColumnPercentages(widths: string[]): number[] {
    if (widths.length > this.columns) {
      throw new Error('Received more column definitions than data columns');
    }

    return widths.map((width) => {
      if (!width.includes('%')) {
        throw new Error(`Invalid column width: "${width}"`);
      }
      const w = width.trim().replaceAll('%', '');
      const numericWidth = Number.parseInt(w, 10);

      return numericWidth / 100;
    });
  }

  private getFontStyle(index: number) {
    if (!Array.isArray(this.fontStyles)) {
      return this.fontStyles;
    }

    return this.fontStyles[index];
  }

  private getColumnWidth(index: number): number {
    if (!Array.isArray(this.columnWidths)) {
      return this.columnWidths || 0;
    }

    return this.columnWidths[index];
  }

  private getBackgroundColor(index: number): string {
    if (!Array.isArray(this.background)) {
      return this.background || '#fff';
    }

    return this.background[index % this.background.length];
  }
}
