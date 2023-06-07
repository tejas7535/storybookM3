import { Component, Input, OnInit } from '@angular/core';

import { combineLatest, map, Observable, take } from 'rxjs';

import {
  getMaterialComparableCosts,
  userHasGPCRole,
  userHasRegionAmericasRole,
  userHasRegionWorldRole,
  userHasSQVRole,
} from '@gq/core/store/selectors';
import { MaterialComparableCost } from '@gq/shared/models/quotation-detail/material-comparable-cost.model';
import { calculateMargin } from '@gq/shared/utils/pricing.utils';
import { Store } from '@ngrx/store';

interface MaterialComparableCostWithMargin extends MaterialComparableCost {
  gpi?: number;
  gpm?: number;
}

@Component({
  selector: 'gq-material-comparable-cost-details',
  templateUrl: './material-comparable-cost-details.component.html',
})
export class MaterialComparableCostDetailsComponent implements OnInit {
  @Input() price: number;
  @Input() currency: string;
  @Input() sapPriceUnit: number;

  materialComparableCosts$: Observable<MaterialComparableCostWithMargin[]>;

  userHasNeededRegionalRoleForMargins$: Observable<boolean>;
  userHasGPCRole$: Observable<boolean>;
  userHasSQVRole$: Observable<boolean>;

  trackByFn(index: number): number {
    return index;
  }

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.checkUserRoles();
    this.processMaterialComparableCosts();
  }

  private checkUserRoles(): void {
    this.userHasGPCRole$ = this.store.pipe(userHasGPCRole);
    this.userHasSQVRole$ = this.store.pipe(userHasSQVRole);

    this.userHasNeededRegionalRoleForMargins$ = combineLatest([
      this.store.pipe(userHasRegionWorldRole),
      this.store.pipe(userHasRegionAmericasRole),
    ]).pipe(
      take(1),
      map(
        ([hasRegionWorldRole, hasRegionAmericasRole]) =>
          hasRegionWorldRole || hasRegionAmericasRole
      )
    );
  }

  private processMaterialComparableCosts(): void {
    this.materialComparableCosts$ = combineLatest([
      this.userHasNeededRegionalRoleForMargins$,
      this.userHasGPCRole$,
      this.userHasSQVRole$,
      this.store.select(getMaterialComparableCosts),
    ]).pipe(
      take(1),
      map(
        ([
          userHasNeededRegionalRoleForMargins,
          hasGPCRole,
          hasSQVRole,
          materialComparableCosts,
        ]) => {
          if (userHasNeededRegionalRoleForMargins) {
            return materialComparableCosts.map(
              (materialComparableCost: MaterialComparableCost) =>
                this.mapToMaterialComparableCostWithMargin(
                  materialComparableCost,
                  hasGPCRole,
                  hasSQVRole
                )
            );
          }

          return materialComparableCosts;
        }
      )
    );
  }

  private mapToMaterialComparableCostWithMargin(
    materialComparableCost: MaterialComparableCost,
    hasGPCRole: boolean,
    hasSQVRole: boolean
  ): MaterialComparableCostWithMargin {
    const processedMaterialComparableCost: MaterialComparableCostWithMargin = {
      ...materialComparableCost,
    };

    if (hasGPCRole) {
      processedMaterialComparableCost.gpi = calculateMargin(
        this.price,
        materialComparableCost.gpc
      );
    }

    if (hasSQVRole) {
      processedMaterialComparableCost.gpm = calculateMargin(
        this.price,
        materialComparableCost.sqv
      );
    }

    return processedMaterialComparableCost;
  }
}
