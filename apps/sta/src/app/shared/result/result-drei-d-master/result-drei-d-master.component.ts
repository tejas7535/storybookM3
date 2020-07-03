import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { AppState, getClassificationForText } from '../../../core/store';
import { ClassificationText } from '../../../core/store/reducers/drei-d-master/models/classification-for-text.model';
import { fadeInAnimation } from '../../animations/fade-in-animation';

@Component({
  selector: 'sta-result-drei-d-master',
  templateUrl: './result-drei-d-master.component.html',
  styleUrls: ['./result-drei-d-master.component.scss'],
  animations: [fadeInAnimation],
})
export class ResultDreiDMasterComponent implements OnInit {
  public classificationResult$: Observable<ClassificationText>;

  constructor(private readonly store: Store<AppState>) {}

  public ngOnInit(): void {
    this.classificationResult$ = this.store.pipe(
      select(getClassificationForText)
    );
  }
  /**
   * Helps Angular to track array
   */
  public trackByFn(index: number): number {
    return index;
  }
}
