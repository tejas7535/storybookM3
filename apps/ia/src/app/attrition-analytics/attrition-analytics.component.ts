import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { NavItem } from '../shared/nav-buttons/models';
import { getAvailableClusters } from './store/selectors/attrition-analytics.selector';

@Component({
  selector: 'ia-attrition-analytics',
  templateUrl: './attrition-analytics.component.html',
  styleUrls: ['./attrition-analytics.scss'],
})
export class AttritionAnalyticsComponent {
  constructor(private readonly store: Store) {}

  clusters: Observable<NavItem[]> = this.store.select(getAvailableClusters);
}
