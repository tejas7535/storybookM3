import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { combineLatest, map, Observable, take } from 'rxjs';

import {
  getMaterialComparableCosts,
  userHasGPCRole,
  userHasRegionAmericasRole,
  userHasRegionWorldRole,
  userHasSQVRole,
} from '@gq/core/store/selectors';
import { MaterialComparableCost } from '@gq/shared/models/quotation-detail/material-comparable-cost.model';
import {
  calculateMargin,
  roundToTwoDecimals,
} from '@gq/shared/utils/pricing.utils';
import { Store } from '@ngrx/store';

interface MaterialComparableCostWithMargin extends MaterialComparableCost {
  gpi?: number;
  gpm?: number;
}

@Component({
  selector: 'gq-material-comparable-cost-details',
  templateUrl: './material-comparable-cost-details.component.html',
})
export class MaterialComparableCostDetailsComponent
  implements OnInit, OnChanges
{
  @Input() price: number;
  @Input() materialPriceUnit: number;
  @Input() currency: string;
  @Input() sapPriceUnit: number;

  materialComparableCosts$: Observable<MaterialComparableCostWithMargin[]>;

  userHasNeededRegionalRoleForMargins$: Observable<boolean>;
  userHasGPCRole$: Observable<boolean>;
  userHasSQVRole$: Observable<boolean>;

  constructor(private readonly store: Store) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Do not execute the processMaterialComparableCosts logic on price first change (when the price parameter is initially set) because the role check (executed in ngOnInit) has not completed yet.
    // The processMaterialComparableCosts logic is executed initially in ngOnInit after user roles check.
    if (changes.price && !changes.price.firstChange) {
      this.processMaterialComparableCosts();
    }
  }

  ngOnInit(): void {
    this.checkUserRoles();
    this.processMaterialComparableCosts();
  }

  trackByFn(index: number): number {
    return index;
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
        roundToTwoDecimals(materialComparableCost.gpc)
      );
    }

    if (hasSQVRole) {
      processedMaterialComparableCost.gpm = calculateMargin(
        this.price,
        roundToTwoDecimals(materialComparableCost.sqv)
      );
    }

    return processedMaterialComparableCost;
  }
}
