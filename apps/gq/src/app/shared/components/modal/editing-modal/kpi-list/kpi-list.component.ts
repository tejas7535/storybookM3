import { Component, Input } from '@angular/core';

import { take } from 'rxjs';

import { getQuotationCurrency } from '@gq/core/store/active-case/active-case.selectors';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { ColumnFields } from '../../../../ag-grid/constants/column-fields.enum';
import { PRICE_VALIDITY_MARGIN_THRESHOLD } from '../../../../constants';
import { QuotationDetail } from '../../../../models/quotation-detail';
import { EditingModal } from '../models/editing-modal.model';
import {
  KpiDisplayValue,
  KpiValue,
  KpiValueFormatter,
} from '../models/kpi-value.model';

@Component({
  selector: 'gq-kpi-list',
  templateUrl: './kpi-list.component.html',
})
export class KpiListComponent {
  @Input() editingModalData: EditingModal;

  @Input() set kpis(kpis: KpiValue[]) {
    this.store
      .select<string>(getQuotationCurrency)
      .pipe(take(1))
      .subscribe((currency: string) => {
        this.displayedKpis = kpis.map((kpi: KpiValue) =>
          this.mapToKpiDisplayValue(kpi, currency)
        );
      });
  }

  displayedKpis: KpiDisplayValue[];

  private readonly kpiToValueFormatter = new Map<
    keyof QuotationDetail,
    KpiValueFormatter
  >([
    [ColumnFields.GPI, KpiValueFormatter.PERCENT],
    [ColumnFields.GPM, KpiValueFormatter.PERCENT],
    [ColumnFields.DISCOUNT, KpiValueFormatter.PERCENT],
    [ColumnFields.PRICE, KpiValueFormatter.NUMBER_CURRENCY],
    [ColumnFields.TARGET_PRICE, KpiValueFormatter.NUMBER_CURRENCY],
  ]);

  constructor(
    private readonly store: Store,
    private readonly transformationService: TransformationService
  ) {}

  private mapToKpiDisplayValue(
    kpi: KpiValue,
    currency: string
  ): KpiDisplayValue {
    return {
      ...kpi,
      ...this.buildDisplayValues(kpi, currency),
      ...this.checkForWarning(kpi),
    };
  }

  private buildDisplayValues(
    kpi: KpiValue,
    currency: string
  ): Pick<KpiDisplayValue, 'displayValue' | 'previousDisplayValue'> {
    let displayValue = '';
    let previousDisplayValue = '';

    const valueFormatter = this.kpiToValueFormatter.get(kpi.key);
    const quotationDetail = this.editingModalData.quotationDetail as any;

    if (valueFormatter === KpiValueFormatter.PERCENT) {
      displayValue = this.transformationService.transformPercentage(kpi.value);
      previousDisplayValue = this.transformationService.transformPercentage(
        quotationDetail[kpi.key]
      );
    } else if (valueFormatter === KpiValueFormatter.NUMBER_CURRENCY) {
      displayValue = this.transformationService.transformNumberCurrency(
        kpi.value,
        currency
      );
      previousDisplayValue = this.transformationService.transformNumberCurrency(
        quotationDetail[kpi.key],
        currency
      );
    }

    return {
      displayValue,
      previousDisplayValue,
    };
  }

  private checkForWarning(
    kpi: KpiValue
  ): Pick<KpiDisplayValue, 'hasWarning' | 'hasError' | 'warningText'> {
    let hasWarning = false;
    let hasError = false;
    let warningText: string;

    if (
      (kpi.key === ColumnFields.GPI || kpi.key === ColumnFields.GPM) &&
      kpi.value &&
      kpi.value <= PRICE_VALIDITY_MARGIN_THRESHOLD
    ) {
      hasWarning = true;
      warningText = translate('shared.validation.gpmOrGpiTooLow');
    } else if (
      kpi.key === ColumnFields.PRICE &&
      this.editingModalData.quotationDetail.msp &&
      kpi.value < this.editingModalData.quotationDetail.msp
    ) {
      hasError = true;
      warningText = translate('shared.validation.priceLowerThanMsp');
    }

    return {
      hasWarning,
      hasError,
      warningText,
    };
  }
}
