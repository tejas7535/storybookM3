import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CellClassParams } from '@ag-grid-community/all-modules';

import { AppRoutePath } from '../../../../app-route-path.enum';

@Component({
  selector: 'gq-position-id',
  templateUrl: './position-id.component.html',
  styles: [],
})
export class PositionIdComponent {
  itemId: number;
  gqPositionId: string;

  constructor(private readonly router: Router) {}
  agInit(params: CellClassParams): void {
    this.itemId = params.value;
    this.gqPositionId = params.data.gqPositionId;
  }
  navigate(event: MouseEvent): void {
    event.preventDefault();
    this.router.navigate([AppRoutePath.DetailViewPath], {
      queryParamsHandling: 'merge',
      queryParams: {
        gqPositionId: this.gqPositionId,
      },
    });
  }
}
