import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

import { IStatusPanelAngularComp } from 'ag-grid-angular/lib/interfaces';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'cdba-total-cost-share',
  templateUrl: './total-cost-share.component.html',
  styleUrls: ['./total-cost-share.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TotalCostShareComponent implements IStatusPanelAngularComp {
  public agInit(): void {}
}

@NgModule({
  imports: [SharedTranslocoModule],
  declarations: [TotalCostShareComponent],
  exports: [TotalCostShareComponent],
})
export class TotalCostShareComponentModule {}
