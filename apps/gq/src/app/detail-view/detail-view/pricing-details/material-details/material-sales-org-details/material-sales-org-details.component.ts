import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import {
  getMaterialSalesOrg,
  getMaterialSalesOrgDataAvailable,
} from '@gq/core/store/selectors';
import { Store } from '@ngrx/store';

import { MaterialSalesOrg } from '../../../../../shared/models/quotation-detail/material-sales-org.model';

@Component({
  selector: 'gq-material-sales-org-details',
  templateUrl: './material-sales-org-details.component.html',
})
export class MaterialSalesOrgDetailsComponent implements OnInit {
  materialSalesOrg$: Observable<MaterialSalesOrg>;
  materialSalesOrgDataAvailable$: Observable<boolean>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.materialSalesOrg$ = this.store.select(getMaterialSalesOrg);
    this.materialSalesOrgDataAvailable$ = this.store.select(
      getMaterialSalesOrgDataAvailable
    );
  }
}
