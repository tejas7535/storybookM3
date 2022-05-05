import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import {
  createCase,
  getCustomerConditionsValid,
} from '../../../../../core/store';
import {
  CASE_CREATION_TYPES,
  CaseCreationEventParams,
  EVENT_NAMES,
} from '../../../../models';

@Component({
  selector: 'gq-create-case-button',
  templateUrl: './create-case-button.component.html',
})
export class CreateCaseButtonComponent implements OnInit {
  createCaseEnabled$: Observable<boolean>;
  constructor(
    private readonly store: Store,
    private readonly insightsService: ApplicationInsightsService
  ) {}
  ngOnInit(): void {
    this.createCaseEnabled$ = this.store.select(getCustomerConditionsValid);
  }

  createCase(): void {
    this.store.dispatch(createCase());

    this.insightsService.logEvent(EVENT_NAMES.CASE_CREATION_FINISHED, {
      type: CASE_CREATION_TYPES.MANUAL,
    } as CaseCreationEventParams);
  }

  agInit(): void {}
}
