import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LetDirective, PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  getAdvancedBearingSelectionResultsCount,
  getBearingSelectionLoading,
} from '@ga/core/store';

import { tooManyBearingsResultsThreshold } from '../../constants';

@Component({
  selector: 'ga-bearing-selection-button',
  standalone: true,
  imports: [
    CommonModule,
    LetDirective,
    PushPipe,
    SharedTranslocoModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './bearing-selection-button.component.html',
})
export class BearingSelectionButtonComponent {
  @Output() buttonClick = new EventEmitter();

  public resultsThreshold = tooManyBearingsResultsThreshold;

  public bearingSelectionLoading$ = this.store.select(
    getBearingSelectionLoading
  );

  public advancedBearingSelectionResultsCount$ = this.store.select(
    getAdvancedBearingSelectionResultsCount
  );

  constructor(private readonly store: Store) {}

  public onButtonClick(): void {
    this.buttonClick.emit();
  }

  public isValidSelection(resultsCount: number): boolean {
    return resultsCount > 0 && resultsCount <= tooManyBearingsResultsThreshold;
  }
}
