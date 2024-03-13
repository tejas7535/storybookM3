import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { RecommendationResponse } from '@lsa/shared/models';
import { RecommendationTableDataPipe } from '@lsa/shared/pipes/recommendation-table-data.pipe';

import { RecommendationTableComponent } from './recommendation-table/recommendation-table.component';

@Component({
  selector: 'lsa-result',
  standalone: true,
  imports: [
    CommonModule,
    RecommendationTableComponent,
    RecommendationTableDataPipe,
  ],
  templateUrl: './result.component.html',
})
export class ResultComponent {
  @Input() recommendationResult: RecommendationResponse;

  isRecommendedSelected = true;

  onRecommendedSelectedChange(isRecommendedSelected: boolean): void {
    this.isRecommendedSelected = isRecommendedSelected;
  }
}
