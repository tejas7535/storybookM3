import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { translate } from '@ngneat/transloco';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { TagComponent } from '@schaeffler/tag';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared.module';
import { ChipClass, FluctuationType } from '../models';

@Component({
  selector: 'ia-leaving-type-cell-renderer',
  standalone: true,
  imports: [
    SharedModule,
    SharedTranslocoModule,
    TagComponent,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './fluctuation-type-cell-renderer.component.html',
  styleUrls: ['./fluctuation-type-cell-renderer.component.scss'],
})
export class FluctuationTypeCellRendererComponent
  implements ICellRendererAngularComp
{
  type: FluctuationType;
  translatedType: string;
  chipClass: ChipClass;
  fromMessage: string;
  toMessage: string;

  agInit(params: ICellRendererParams): void {
    this.type = params.value;

    if (!Object.values(FluctuationType).includes(params.value)) {
      return;
    }

    switch (params.value) {
      case FluctuationType.UNFORCED: {
        this.chipClass = ChipClass.UNFORCED;
        break;
      }
      case FluctuationType.FORCED: {
        this.chipClass = ChipClass.FORCED;
        break;
      }
      case FluctuationType.REMAINING: {
        this.chipClass = ChipClass.REMAINING;
        break;
      }
      case FluctuationType.INTERNAL: {
        this.chipClass = ChipClass.INTERNAL;
        const internalFrom = params.data.exitDate
          ? params.data.currentDimensionValue
          : params.data.previousDimensionValue;
        const internalTo = params.data.exitDate
          ? params.data.nextDimensionValue
          : params.data.currentDimensionValue;

        const fromTranslated = translate('employeeListDialog.from');
        const toTranslated = translate('employeeListDialog.to');

        this.fromMessage = `${fromTranslated}: ${internalFrom}`;
        this.toMessage = `${toTranslated}: ${internalTo}`;
        break;
      }
      default:
    }

    this.translatedType = translate(
      `employeeListDialog.fluctuationType.${params.value}`
    );
  }

  refresh(params: ICellRendererParams): boolean {
    this.translatedType = params.value;

    return true;
  }
}
