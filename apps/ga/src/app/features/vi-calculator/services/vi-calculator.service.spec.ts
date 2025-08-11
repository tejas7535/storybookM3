import { MatDialog } from '@angular/material/dialog';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
  SpyObject,
} from '@ngneat/spectator/jest';

import { AppAnalyticsService } from '@ga/shared/services/app-analytics-service/app-analytics-service';
import { InteractionEventType } from '@ga/shared/services/app-analytics-service/interaction-event-type.enum';

import { ViCalculatorComponent } from '../vi-calculator.component';
import { ViCalculatorService } from './vi-calculator.service';

describe('ViCalculatorService', () => {
  let spectator: SpectatorService<ViCalculatorService>;
  let service: ViCalculatorService;
  let matDialog: SpyObject<MatDialog>;
  let appAnalyticsService: SpyObject<AppAnalyticsService>;

  const createService = createServiceFactory({
    service: ViCalculatorService,
    providers: [
      mockProvider(MatDialog, {
        open: jest.fn(),
      }),
      mockProvider(AppAnalyticsService, {
        logInteractionEvent: jest.fn(),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    matDialog = spectator.inject(MatDialog);
    appAnalyticsService = spectator.inject(AppAnalyticsService);

    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('showViscosityIndexCalculator', () => {
    it('should log interaction event and open dialog', () => {
      service.showViscosityIndexCalculator();

      expect(appAnalyticsService.logInteractionEvent).toHaveBeenCalledWith(
        InteractionEventType.OpenViscosityIndexCalculator
      );

      expect(matDialog.open).toHaveBeenCalledWith(ViCalculatorComponent, {
        panelClass: 'w-full',
      });
    });

    it('should call analytics service once', () => {
      service.showViscosityIndexCalculator();

      expect(appAnalyticsService.logInteractionEvent).toHaveBeenCalledTimes(1);
    });

    it('should call dialog open once', () => {
      service.showViscosityIndexCalculator();

      expect(matDialog.open).toHaveBeenCalledTimes(1);
    });

    it('should use correct dialog configuration', () => {
      service.showViscosityIndexCalculator();

      expect(matDialog.open).toHaveBeenCalledWith(
        ViCalculatorComponent,
        expect.objectContaining({
          panelClass: 'w-full',
        })
      );
    });
  });
});
