import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { setBearingSelectionType } from '@ga/core/store';
import { BearingSelectionType } from '@ga/shared/models';

@Component({
  selector: 'ga-advanced-bearing-button',
  standalone: true,
  imports: [CommonModule, SharedTranslocoModule, MatButtonModule],
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
