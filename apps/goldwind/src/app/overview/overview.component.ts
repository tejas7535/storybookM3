import { Component } from '@angular/core';

@Component({
  selector: 'goldwind-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  devices = [123, 456];

  public trackByFn(index: number, _item: any): number {
    return index;
  }
}
