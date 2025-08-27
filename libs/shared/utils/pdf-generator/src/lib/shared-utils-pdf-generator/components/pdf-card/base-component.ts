import { Colors } from '../../constants';
import { Component } from '../../core';

export interface Link {
  text: string;
  url: string;
  qrCodeBase64?: string;
}

export abstract class CardBaseComponent extends Component {
  protected backgroundColor: string = Colors.Surface;
  protected padding = 0;
  protected margin = 0;
  protected calculatedHeight = 0;

  protected renderBackground(): void {
    if (!this.backgroundColor) {
      return;
    }
    const doc = this.assertDoc();

    doc.setFillColor(this.backgroundColor);
    doc.rect(
      this.bounds.x,
      this.bounds.y,
      this.bounds.width,
      this.calculatedHeight,
      'F'
    );
  }
}
