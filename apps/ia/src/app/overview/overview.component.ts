// tslint:disable no-default-import
import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { EmployeeState } from '../core/store/reducers/employee/employee.reducer';
import { getEmployees, getEmployeesLoading } from '../core/store/selectors';
import { Employee } from '../shared/models';

@Component({
  selector: 'ia-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  employees$: Observable<Employee[]>;
  isLoading$: Observable<boolean>;

  public constructor(private readonly store: Store<EmployeeState>) {}

  public ngOnInit(): void {
    this.employees$ = this.store.pipe(select(getEmployees));
    this.isLoading$ = this.store.pipe(select(getEmployeesLoading));
  }
}
