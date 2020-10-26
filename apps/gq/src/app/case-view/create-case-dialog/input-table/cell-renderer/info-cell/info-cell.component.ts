import { Component } from '@angular/core';

@Component({
  selector: 'gq-info-cell',
  templateUrl: './info-cell.component.html',
  styleUrls: ['./info-cell.component.scss'],
})
export class InfoCellComponent {
  public valid: string;

  agInit(params: any): void {
    this.valid = params.value;
  }
}
