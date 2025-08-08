import { Injectable } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';

@Injectable({ providedIn: 'root' })
export class ComparisonChartService {
  constructor(private readonly transloco: TranslocoService) {}

  readonly PURCHASE = this.transloco.translate(
    'compare.summary.common.purchase'
  );
  readonly REMAINDER = this.transloco.translate(
    'compare.summary.common.remainder'
  );
  readonly MOH = this.transloco.translate('compare.summary.common.moh');
  readonly BURDEN = this.transloco.translate('compare.summary.common.burden');
  readonly LABOUR = this.transloco.translate('compare.summary.common.labour');
  readonly RAW_MATERIAL = this.transloco.translate(
    'compare.summary.common.rawMaterial'
  );
  readonly TOTAL = this.transloco.translate('compare.summary.common.total');
}
