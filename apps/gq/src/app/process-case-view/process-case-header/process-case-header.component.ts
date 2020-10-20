import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Customer } from '../../core/store/models';
import { ProcessCaseState } from '../../core/store/reducers/process-case/process-case.reducers';
import { getCustomer } from '../../core/store/selectors';

@Component({
  selector: 'gq-process-case-header',
  templateUrl: './process-case-header.component.html',
  styleUrls: ['./process-case-header.component.scss'],
})
export class ProcessCaseHeaderComponent implements OnInit {
  @Input() quotationNumber: string;

  customer$: Observable<Customer>;

  constructor(private readonly store: Store<ProcessCaseState>) {}

  public ngOnInit(): void {
    this.customer$ = this.store.pipe(select(getCustomer));
  }
}
