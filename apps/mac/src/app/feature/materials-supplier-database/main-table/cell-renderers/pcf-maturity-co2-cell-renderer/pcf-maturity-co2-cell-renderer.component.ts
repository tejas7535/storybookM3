import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import { take } from 'rxjs';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';

@Component({
  selector: 'mac-pcf-maturity-co2-cell-renderer',
  templateUrl: './pcf-maturity-co2-cell-renderer.component.html',
  imports: [
    // default
    CommonModule,
    // angular material
    MatTooltipModule,
    // libs
    SharedTranslocoModule,
  ],
})
export class PcfMaturityCo2CellRendererComponent
  implements ICellRendererAngularComp
{
  public params: ICellRendererParams;
  public hideValue = true;

  constructor(private readonly dataFacade: DataFacade) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
    const hasValue = !!(this.params.value === 0 || this.params.value);
    const maturity = this.params.data['maturity'];

    if (hasValue && maturity < 5) {
      this.dataFacade.hasMatnrUploaderRole$
        .pipe(take(1))
        .subscribe((isUploader) => {
          this.hideValue = !isUploader;
        });
    } else {
      this.hideValue = false;
    }
  }

  refresh(): boolean {
    return false;
  }
}
