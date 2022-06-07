import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { setBearingSelectionType } from '@ga/core/store';
import { BearingSelectionType } from '@ga/shared/models';

@Component({
  selector: 'ga-advanced-bearing-button',
  templateUrl: './advanced-bearing-button.component.html',
})
export class AdvancedBearingButtonComponent {
  public constructor(
    private readonly store: Store,
    private readonly router: Router
  ) {}

  public onButtonClick(): void {
    this.store.dispatch(
      setBearingSelectionType({
        bearingSelectionType: BearingSelectionType.AdvancedSelection,
      })
    );
    this.router.navigate([AppRoutePath.GreaseCalculationPath]);
  }
}
