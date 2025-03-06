import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';

import { map } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';
import { TAILWIND_SCREENS } from '@lsa/shared/constants';
import { RecommendationTableData } from '@lsa/shared/models';

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
  ],
  templateUrl: './recommendation-table.component.html',
})
export class RecommendationTableComponent implements AfterViewInit {
  @Input() data!: RecommendationTableData;
  @Output() recommendedSelectedChange = new EventEmitter<boolean>();

  headerColsSpan = toSignal(
    this.breakpointObserver
      .observe([`(min-width: ${TAILWIND_SCREENS.MD})`])
      .pipe(map((state) => (state.matches ? 1 : 2)))
  );

  isRecommendedSelected = false;

  constructor(private readonly breakpointObserver: BreakpointObserver) {}

  get displayedColumns(): string[] {
    const columns = ['field'];
    if (this.data.headers.minimum) {
      columns.push('minimum');
    }
    if (this.data.headers.recommended) {
      columns.push('recommended');
    }

    return columns;
  }

  ngAfterViewInit(): void {
    this.isRecommendedSelected = !!(this.data?.headers.recommended ?? false);
  }

  onHeaderSelectionChange({ isRecommended }: { isRecommended: boolean }): void {
    this.isRecommendedSelected = isRecommended;
    this.recommendedSelectedChange.emit(isRecommended);
  }
}
