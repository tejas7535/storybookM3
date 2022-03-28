import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { environment } from '../../environments/environment';
import { AppRoutePath } from '../app-route-path.enum';
import { HOMECARD } from '../shared/constants';

@Component({
  selector: 'ga-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  greaseCalculationLink = `/${AppRoutePath.GreaseCalculationPath}`;
  sources = environment.production
    ? '?utm_source=grease-app&utm_medium=app'
    : '';

  public constructor(
    public readonly router: Router,
    private readonly applicationInsightsService: ApplicationInsightsService
  ) {}

  public startCalculator(): void {
    this.trackCardClick('greaseCalculation');
    this.router.navigate([this.greaseCalculationLink]);
  }

  public trackCardClick(card: string): void {
    this.applicationInsightsService.logEvent(HOMECARD, {
      card,
    });
  }
}
