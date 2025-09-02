import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';

import { map } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';
import { RestService } from '@lsa/core/services/rest.service';
import { TAILWIND_SCREENS } from '@lsa/shared/constants';
import { RecommendationTableData } from '@lsa/shared/models';

import { InfoBannerComponent } from '@schaeffler/feedback-banner';

import { LegalDisclaimerComponent } from '../legal-disclaimer/legal-disclaimer.component';
import { RecommendationSelectionMobileComponent } from '../recommendation-selection-mobile/recommendation-selection-mobile';
import { LubricatorHeaderComponent } from './lubricator-header/lubricator-header.component';
import { RecommendationTableCellComponent } from './recommendation-table-cell/recommendation-table-cell.component';

@Component({
  selector: 'lsa-recommendation-table',
  imports: [
    CommonModule,
    MatTableModule,
    LubricatorHeaderComponent,
    RecommendationTableCellComponent,
    TranslocoModule,
    RecommendationSelectionMobileComponent,
    MatRadioModule,
    LegalDisclaimerComponent,
    InfoBannerComponent,
  ],
  templateUrl: './recommendation-table.component.html',
})
export class RecommendationTableComponent {
  public readonly data = input<RecommendationTableData>();
  public recommendedSelectedChange = output<boolean>();

  public isRecommendedSelected = signal(false);

  protected readonly breakpointObserver = inject(BreakpointObserver);
  protected readonly restService = inject(RestService);

  protected headerColsSpan = toSignal(
    this.breakpointObserver
      .observe([`(min-width: ${TAILWIND_SCREENS.MD})`])
      .pipe(map((state) => (state.matches ? 1 : 2)))
  );

  constructor() {
    effect(() => {
      const shouldPreselectRecommendation = !!(
        this.data()?.headers.recommended ?? false
      );
      this.isRecommendedSelected.set(shouldPreselectRecommendation);
    });
    effect(() => {
      const isRecommendationSelected = this.isRecommendedSelected();
      this.recommendedSelectedChange.emit(isRecommendationSelected);
    });
  }

  get displayedColumns(): string[] {
    const columns = ['field'];
    if (this.data().headers.minimum) {
      columns.push('minimum');
    }
    if (this.data().headers.recommended) {
      columns.push('recommended');
    }

    return columns;
  }

  onHeaderSelectionChange({ isRecommended }: { isRecommended: boolean }): void {
    this.isRecommendedSelected.set(isRecommended);
    this.recommendedSelectedChange.emit(this.isRecommendedSelected());
  }
}
