import { Component, Rect } from '../../core';

/**
 * A component that conditionally adds a page break if the remaining space on the current page
 * is less than a specified minimum height.
 */
export class ConditionalPageBreak extends Component {
  public constructor(private readonly minRemainingHeight: number = 100) {
    super();
  }

  public override evaluate(
    bounds: Rect
  ): [boolean, number, Component?, Component?] {
    super.evaluate(bounds);

    const doc = this.assertDoc();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pdfDoc = this._pdfDoc;

    if (!pdfDoc) {
      return [true, 0];
    }

    const remainingHeight = pageHeight - bounds.y - pdfDoc.insets('bottom');

    if (remainingHeight < this.minRemainingHeight) {
      return [false, 0, undefined, this];
    }

    return [true, 0];
  }

  public override render(): void {
    super.render();
  }
}
