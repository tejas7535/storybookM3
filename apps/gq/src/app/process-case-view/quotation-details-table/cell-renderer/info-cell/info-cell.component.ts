import { Component } from '@angular/core';

@Component({
  selector: 'gq-info-cell',
  templateUrl: './info-cell.component.html',
  styleUrls: ['./info-cell.component.scss'],
})
export class InfoCellComponent {
  public addToOffer: boolean;

  agInit(params: any): void {
    this.addToOffer = params.value;
  }
}
