import { Component, Input, OnInit } from '@angular/core';
import { MaterialAlternativeCost } from '../../../../shared/models/quotation-detail/material-alternative-cost.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { getMaterialAlternativeCosts } from '../../../../core/store';

@Component({
  selector: 'gq-material-alternative-cost-details',
  templateUrl: './material-alternative-cost-details.component.html',
})
export class MaterialAlternativeCostDetailsComponent implements OnInit {
  materialAlternativeCosts$: Observable<MaterialAlternativeCost[]>;
  @Input() currency: string;

  trackByFn(index: number): number {
    return index;
  }

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.materialAlternativeCosts$ = this.store.select(
      getMaterialAlternativeCosts
    );
  }
}
