import { Component } from '@angular/core';

@Component({
  selector: 'goldwind-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  devices = [
    'a3d3668d-aae8-47ee-a033-7bfbe152fda7',
    'a3d3668d-aae8-47ee-a033-7bfbe152fda7',
  ];

  public trackByFn(index: number, _item: any): number {
    return index;
  }
}
