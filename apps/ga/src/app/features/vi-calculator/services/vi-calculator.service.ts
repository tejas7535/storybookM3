import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AppAnalyticsService } from '@ga/shared/services/app-analytics-service/app-analytics-service';
import { InteractionEventType } from '@ga/shared/services/app-analytics-service/interaction-event-type.enum';

import { ViCalculatorComponent } from '../vi-calculator.component';

@Injectable({
  providedIn: 'root',
})
export class ViCalculatorService {
  private readonly dialog = inject(MatDialog);
  private readonly appAnalyticsService = inject(AppAnalyticsService);

  showViscosityIndexCalculator(): void {
    this.appAnalyticsService.logInteractionEvent(
      InteractionEventType.OpenViscosityIndexCalculator
    );

    this.dialog.open(ViCalculatorComponent, {
      panelClass: 'w-full',
    });
  }
}
