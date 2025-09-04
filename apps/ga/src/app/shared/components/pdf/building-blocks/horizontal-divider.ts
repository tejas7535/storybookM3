import { Colors, Component } from '@schaeffler/pdf-generator';

export class HorizontalDivider extends Component {
  constructor(
    private readonly color: string = Colors.Outline,
    private readonly thickness: number = 0.5
  ) {
    super();
  }

  public evaluate(): [boolean, number] {
    return [true, this.thickness + 0.1]; // Reduced spacing around divider
  }

  public render(): void {
    const doc = this.assertDoc();
    doc.setDrawColor(this.color);
    doc.setLineWidth(this.thickness);
    doc.line(
      this.bounds.x,
      this.bounds.y + 0.1,
      this.bounds.x + this.bounds.width,
      this.bounds.y + 0.1
    );
  }
}
