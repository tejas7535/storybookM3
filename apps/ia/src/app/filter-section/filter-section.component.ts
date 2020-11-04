import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { filterSelected } from '../core/store/actions';
import { EmployeeState } from '../core/store/reducers/employee/employee.reducer';
import { getOrganizations } from '../core/store/selectors';
import { Filter } from '../shared/models';

@Component({
  selector: 'ia-filter-section',
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.scss'],
})
export class FilterSectionComponent implements OnInit {
  organizations$: Observable<Filter>;

  public constructor(private readonly store: Store<EmployeeState>) {}

  public ngOnInit(): void {
    this.organizations$ = this.store.pipe(select(getOrganizations));
  }

  public optionSelected(filter: Filter): void {
    this.store.dispatch(filterSelected({ filter }));
  }
}
