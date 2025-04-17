import { Component } from '../../core/component';
import { Paddings } from '../../core/format';
import { Rect } from '../../core/rect';
import { mergeDefaults } from '../../core/util';
import { Grid } from '.';
import {
  GridLabel,
  LabelValues,
  Styles as LabelStyles,
} from './label.component';

interface Styles {
  labelStyle?: LabelStyles['labelStyle'];
  valueStyle?: LabelStyles['valueStyle'];
  borders: {
    vertical?: string;
    horizontal?: string;
  };
  cellPadding: Paddings;
}

interface Props {
  style?: Partial<Styles>;
  layout: {
    columns?: number;
    rows?: number;
  };
  data: LabelValues[];
}

const DefaultStyles: Styles = {
  borders: {
    vertical: '#f3f3f3',
    horizontal: '#f3f3f3',
  },
  cellPadding: {
    left: 2,
    right: 2,
    bottom: 4,
    top: 4,
  },
} as const;

export class LabelGrid extends Component {
  private readonly cellInsets: Paddings;

  private readonly styles: Omit<Styles, 'cellPadding'>;

  private readonly data: Props['data'];

  private gridSize: { rows: number; columns: number } = { rows: 0, columns: 0 };
  private readonly userLayout: Props['layout'];

  private columnWidth = -1;

  private contentWidth = -1;

  private readonly rowHeights: { height: number; labels: LabelValues[] }[] = [];

  constructor({ style, layout, data }: Props) {
    super();
    this.userLayout = layout;

    this.data = data;
    this.cellInsets = mergeDefaults(
      style?.cellPadding,
      DefaultStyles.cellPadding
    );
    this.styles = {
      borders: mergeDefaults(style?.borders, DefaultStyles.borders),
      labelStyle: style?.labelStyle,
      valueStyle: style?.valueStyle,
    };
  }

  public override evaluate(
    bounds: Rect
  ): [boolean, number, Component?, Component?] {
    super.evaluate(bounds);
    this.computeGridDimensions(this.userLayout);

    this.columnWidth = this.bounds.width / this.gridSize.columns;
    this.contentWidth =
      this.columnWidth - this.cellInsets.left - this.cellInsets.right;
    const clone = [...this.data];

    const n = this.gridSize.columns;

    let innerHeight = 0;
    for (let i = 0; i < clone.length; i += n) {
      const subset = clone.slice(i, i + n);

      const rowRequiredHeight = this.getRowHeight(subset, this.contentWidth);
      this.rowHeights.push({
        height: rowRequiredHeight,
        labels: subset,
      });
      innerHeight += rowRequiredHeight;
    }

    const spacingHeight =
      (this.cellInsets.top + this.cellInsets.bottom) * this.rowHeights.length;
    const totalHeight = innerHeight + spacingHeight;

    const fits = totalHeight <= this.bounds.height;

    if (fits) {
      return [true, totalHeight];
    }

    const [fitting, remainder] = this.splitItemsForHeight(this.bounds.height);

    return [fits, totalHeight, fitting || undefined, remainder];
  }

  public override render(): void {
    super.render();
    const baseX = this.bounds.x + this.cellInsets.left;
    let currentY = this.bounds.y + this.cellInsets.top;

    for (const [_, row] of this.rowHeights.entries()) {
      for (const [cix, labelValue] of row.labels.entries()) {
        const r = new Rect(
          baseX + cix * (this.cellInsets.right + this.columnWidth),
          currentY,
          row.height,
          this.columnWidth
        );
        const component = new GridLabel({
          value: labelValue,
          styles: {
            labelStyle: this.styles.labelStyle,
            valueStyle: this.styles.valueStyle,
          },
        });
        component.setDocument(this._pdfDoc!);
        component.evaluate(r);
        component.render();
      }
      currentY += row.height + this.cellInsets.bottom + this.cellInsets.top;
    }
    if (this.styles?.borders?.horizontal) {
      this.drawHorizontalDividers(this.styles.borders.horizontal);
    }

    if (this.styles?.borders?.vertical) {
      this.drawVerticalDividers(this.styles.borders.vertical);
    }
  }

  private drawVerticalDividers(color: string) {
    const doc = this.assertDoc();
    doc.setDrawColor(color);
    let runnningHeight = 0;
    for (let y = 0; y < this.gridSize.rows; y += 1) {
      const yc =
        this.bounds.y +
        (this.cellInsets.top + this.cellInsets.bottom) * y +
        runnningHeight +
        this.cellInsets.top;
      const height = this.rowHeights[y].height;
      for (let x = 0; x < this.gridSize.columns; x += 1) {
        if (x === 0) {
          continue;
        }
        const xc = this.bounds.x + this.columnWidth * x;
        doc.line(xc, yc, xc, yc + height);
      }
      runnningHeight += height;
    }
  }

  private drawHorizontalDividers(color: string) {
    const doc = this.assertDoc();
    doc.setDrawColor(color);
    let runningHeight = 0;
    for (const [_, row] of this.rowHeights.entries()) {
      runningHeight +=
        row.height + this.cellInsets.bottom + this.cellInsets.top;
      const y = this.bounds.y + runningHeight;
      doc.line(this.bounds.x, y, this.bounds.BottomRight.x, y);
    }
  }

  private splitItemsForHeight(spaceAvailable: number): [Component, Component] {
    const whitespace = this.cellInsets.top + this.cellInsets.bottom;
    const fittingData: LabelValues[] = [];
    const overflowData: LabelValues[] = [];

    let runningHeight = 0;
    for (const item of this.rowHeights) {
      runningHeight += item.height + whitespace;
      if (runningHeight <= spaceAvailable) {
        fittingData.push(...item.labels);
      } else {
        overflowData.push(...item.labels);
      }
    }
    const style: Styles = {
      ...this.styles,
      cellPadding: this.cellInsets,
    };

    return [
      new Grid({ style, layout: this.userLayout, data: fittingData }),
      new Grid({ style, layout: this.userLayout, data: overflowData }),
    ];
  }

  private getRowHeight(items: Props['data'], width: number): number {
    this.assertDoc();
    const components = items.map(
      (item) =>
        new GridLabel({
          value: item,
          styles: {
            labelStyle: this.styles.labelStyle,
            valueStyle: this.styles.valueStyle,
          },
        })
    );

    const fakeBounds = new Rect(0, 0, width, 999);
    const heights = components.map((com) => {
      com.setDocument(this._pdfDoc!);

      return com.evaluate(fakeBounds)[1];
    });

    return Math.max(...heights);
  }

  private computeGridDimensions({ columns, rows }: Props['layout']) {
    const requiredCells = this.data.length;
    const gridSize = { rows: -1, columns: -1 };
    let finalRows = 0;
    let finalCols = 0;

    if (!columns && !rows) {
      throw new Error(
        'Both rows and columns are undefined. You must provide at least one of those properties'
      );
    } else if (columns && rows) {
      const cells = columns * rows;
      finalCols = columns;
      finalRows = rows;

      if (cells < requiredCells) {
        throw new Error(
          `Cannot fit the provided dataset of length ${this.data.length} into grid with total of ${cells} cells`
        );
      }
    } else if (columns && !rows) {
      finalRows = Math.ceil(requiredCells / columns);
      finalCols = columns;
    } else if (!columns && rows) {
      finalCols = Math.ceil(requiredCells / rows);
      finalRows = rows;
    }

    gridSize.rows = finalRows as number;
    gridSize.columns = finalCols as number;
    this.gridSize = gridSize;
  }
}
