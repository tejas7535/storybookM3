import {
  Component,
  Rect,
  SectionHeading,
  Table,
} from '@schaeffler/pdf-generator';

interface Props {
  header: SectionHeading;
  table: Table;
  spacing?: number;
}

export class TableWithHeader extends Component {
  private readonly headerComponent: SectionHeading;
  private readonly tableComponent: Table;
  private readonly spacing: number;

  constructor({ header, table, spacing = 5 }: Props) {
    super();
    this.headerComponent = header;
    this.tableComponent = table;
    this.spacing = spacing;
  }

  public override evaluate(
    bounds: Rect
  ): [boolean, number, Component?, Component?] {
    super.evaluate(bounds);

    this.headerComponent.setDocument(this._pdfDoc);
    const [_headerFits, headerHeight] = this.headerComponent.evaluate(bounds);

    const tableBounds = new Rect(
      bounds.x,
      bounds.y + headerHeight + this.spacing,
      bounds.height - headerHeight - this.spacing,
      bounds.width
    );

    this.tableComponent.setDocument(this._pdfDoc);

    const [tableFits, tableHeight, _fittingPart, _overflowPart] =
      this.tableComponent.evaluate(tableBounds);

    const totalHeight = headerHeight + this.spacing + tableHeight;

    if (tableFits) {
      return [true, totalHeight];
    }

    this.tableComponent.clearRowConfiguration();

    return [false, bounds.height, undefined, this];
  }

  public override render(): void {
    super.render();

    this.headerComponent.render();
    this.tableComponent.render();
  }
}
