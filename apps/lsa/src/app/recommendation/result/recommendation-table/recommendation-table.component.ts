import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';

import { RecommendationTableData } from '@lsa/shared/models';
import { TranslocoModule } from '@ngneat/transloco';

import { LubricatorHeaderComponent } from './lubricator-header/lubricator-header.component';
import { RecommendationTableCellComponent } from './recommendation-table-cell/recommendation-table-cell.component';

@Component({
  selector: 'lsa-recommendation-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    LubricatorHeaderComponent,
    RecommendationTableCellComponent,
    TranslocoModule,
  ],
  templateUrl: './recommendation-table.component.html',
})
export class RecommendationTableComponent implements AfterViewInit {
  @Input() data!: RecommendationTableData;
  @Output() recommendedSelectedChange = new EventEmitter<boolean>();

  isRecommendedSelected = false;

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
    this.isRecommendedSelected = !!this.data?.headers.recommended ?? false;
  }

  onHeaderSelectionChange({ isRecommended }: { isRecommended: boolean }): void {
    this.isRecommendedSelected = isRecommended;
    this.recommendedSelectedChange.emit(isRecommended);
  }
}
