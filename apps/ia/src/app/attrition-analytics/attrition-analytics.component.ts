import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { loadEmployeeAnalytics } from './store/actions/attrition-analytics.action';

@Component({
  selector: 'ia-attrition-analytics',
  templateUrl: './attrition-analytics.component.html',
})
export class AttritionAnalyticsComponent implements OnInit {
  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(loadEmployeeAnalytics());
  }
}
