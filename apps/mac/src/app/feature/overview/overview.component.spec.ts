import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

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
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: OverviewComponent,
    imports: [
      OverviewRoutingModule,
      MatCardModule,
      MatIconModule,
      RouterTestingModule,
      ReactiveComponentModule,
    ],
    providers: [
      provideMockStore({}),
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
    store = spectator.inject(MockStore);
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

  describe('hasRequiredRoles', () => {
    it('should return true if no roles are required (empty)', () => {
      store.select = jest.fn();

      component.hasRequiredRoles([]).subscribe((result) => {
        expect(result).toBe(true);
        expect(store.select).not.toHaveBeenCalled();
      });
    });

    it('should return true if no roles are required', () => {
      store.select = jest.fn();

      // eslint-disable-next-line unicorn/no-useless-undefined
      component.hasRequiredRoles(undefined).subscribe((result) => {
        expect(result).toBe(true);
        expect(store.select).not.toHaveBeenCalled();
      });
    });

    it('should return true if required roles are present', () => {
      store.select = jest.fn(() => of(true));

      component.hasRequiredRoles(['role']).subscribe((result) => {
        expect(result).toBe(true);
        expect(store.select).toHaveBeenCalled();
      });
    });
    it('should return false if required roles are missing', () => {
      store.select = jest.fn(() => of(false));

      component.hasRequiredRoles(['role']).subscribe((result) => {
        expect(result).toBe(false);
        expect(store.select).toHaveBeenCalled();
      });
    });
  });
});
