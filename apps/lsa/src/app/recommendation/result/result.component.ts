import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { ErrorResponse, RecommendationResponse } from '@lsa/shared/models';
import { RecommendationTableDataPipe } from '@lsa/shared/pipes/recommendation-table-data.pipe';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AccessoryTableComponent } from './accessory-table/accessory-table.component';
import { RecommendationTableComponent } from './recommendation-table/recommendation-table.component';

@Component({
  selector: 'lsa-result',
  standalone: true,
  imports: [
    RecommendationTableComponent,
    RecommendationTableDataPipe,
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    AccessoryTableComponent,
    MatButtonModule,
    MatIconModule,
    SharedTranslocoModule,
  ],
  templateUrl: './result.component.html',
})
export class ResultComponent implements OnChanges {
  @Input() recommendationResult: RecommendationResponse | ErrorResponse;

  isRecommendedSelected = true;
  validResult?: RecommendationResponse;
  errorInstance: ErrorResponse;

  onRecommendedSelectedChange(isRecommendedSelected: boolean): void {
    this.isRecommendedSelected = isRecommendedSelected;
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if ('name' in this.recommendationResult) {
      // TODO: Build error handling logic
      this.errorInstance = this.recommendationResult as ErrorResponse;
      this.validResult = undefined;
    } else {
      this.validResult = this.recommendationResult as RecommendationResponse;
      this.isRecommendedSelected =
        !!this.validResult.lubricators.recommendedLubricator;
    }
  }
}
