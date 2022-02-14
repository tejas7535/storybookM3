import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { OverviewComponent } from './overview.component';
import { OverviewRoutingModule } from './overview-routing.module';

jest.mock('../../shared/change-favicon', () => ({
  changeFavicon: jest.fn(() => {}),
}));

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let spectator: Spectator<OverviewComponent>;
  let appInsightsService: ApplicationInsightsService;

  const createComponent = createComponentFactory({
    component: OverviewComponent,
    imports: [
      OverviewRoutingModule,
      MatCardModule,
      MatIconModule,
      RouterTestingModule,
    ],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    mocks: [ApplicationInsightsService],
    declarations: [OverviewComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    appInsightsService = spectator.inject(ApplicationInsightsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('trackByFn', () => {
    it('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });

  describe('tracktrackCall', () => {
    it('should call logevent', () => {
      appInsightsService.logEvent = jest.fn();
      component.trackCall('element1');
      expect(appInsightsService.logEvent).toHaveBeenCalled();
    });
  });
});
