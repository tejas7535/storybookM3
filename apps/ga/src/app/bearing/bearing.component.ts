import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { AppRoutePath } from '@ga/app-route-path.enum';
import {
  getBearingSelectionType,
  setBearingSelectionType,
} from '@ga/core/store';
import { setCurrentStep } from '@ga/core/store/actions/settings/settings.actions';
import {
  BearingSelectionType,
  BearingSelectionTypeUnion,
} from '@ga/shared/models';

@Component({
  selector: 'ga-bearing',
  templateUrl: './bearing.component.html',
})
export class BearingComponent implements OnInit {
  bearingSelectionType = BearingSelectionType;

  public bearingSelectionType$ = this.store.select(getBearingSelectionType);

  public constructor(
    private readonly store: Store,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.store.dispatch(setCurrentStep({ step: 0 }));
  }

  public navigateBack(): void {
    this.router.navigate([AppRoutePath.BasePath]);
  }

  public toggleBearingSelectionType(
    currentBearingSelectionType: BearingSelectionTypeUnion
  ): void {
    const bearingSelectionType =
      currentBearingSelectionType ===
      this.bearingSelectionType.AdvancedSelection
        ? this.bearingSelectionType.QuickSelection
        : this.bearingSelectionType.AdvancedSelection;

    this.store.dispatch(setBearingSelectionType({ bearingSelectionType }));
  }
}
