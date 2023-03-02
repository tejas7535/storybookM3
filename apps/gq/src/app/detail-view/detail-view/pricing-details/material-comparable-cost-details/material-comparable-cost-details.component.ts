import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { getMaterialComparableCosts } from '@gq/core/store/selectors';
import { Store } from '@ngrx/store';

import { MaterialComparableCost } from '../../../../shared/models/quotation-detail/material-comparable-cost.model';

@Component({
  selector: 'gq-material-comparable-cost-details',
  templateUrl: './material-comparable-cost-details.component.html',
})
export class MaterialComparableCostDetailsComponent implements OnInit {
  materialComparableCosts$: Observable<MaterialComparableCost[]>;
  @Input() currency: string;

  trackByFn(index: number): number {
    return index;
  }

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.materialComparableCosts$ = this.store.select(
      getMaterialComparableCosts
    );
  }
}
