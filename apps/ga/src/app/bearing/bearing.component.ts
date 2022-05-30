import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { setCurrentStep } from '@ga/core/store/actions/settings/settings.actions';

@Component({
  selector: 'ga-bearing',
  templateUrl: './bearing.component.html',
})
export class BearingComponent implements OnInit {
  advancedBearingSelectionActive = true;

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

  public toggleBearingSelectionType(): void {
    this.advancedBearingSelectionActive = !this.advancedBearingSelectionActive;
  }
}
