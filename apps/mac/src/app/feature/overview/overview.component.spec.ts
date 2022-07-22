import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../assets/i18n/en.json';
import { OverviewCardModule } from '../../shared/components/overview-card/overview-card.module';
import { OverviewComponent } from './overview.component';
import { OverviewRoutingModule } from './overview-routing.module';

jest.mock('@mac/shared/change-favicon', () => ({
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
      PushModule,
      OverviewCardModule,
      HttpClientTestingModule,
      SubheaderModule,
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          'azure-auth': {
            accountInfo: {},
          },
        },
      }),
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

  describe('trackCall', () => {
    it('should call logevent', () => {
      appInsightsService.logEvent = jest.fn();
      component.trackCall('element1');
      expect(appInsightsService.logEvent).toHaveBeenCalled();
    });
  });

  describe('hasRequiredRoles', () => {
    it('should return true if no roles are required (empty)', (done) => {
      component.hasRequiredRoles([]).subscribe((result) => {
        expect(result).toBe(true);
        done();
      });
    });

    it('should return true if no roles are required', (done) => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      component.hasRequiredRoles(undefined).subscribe((result) => {
        expect(result).toBe(true);
        done();
      });
    });

    it('should return true if required roles are present', (done) => {
      store.setState({
        'azure-auth': {
          accountInfo: {
            idTokenClaims: {
              roles: ['role'],
            },
          },
        },
      });

      component.hasRequiredRoles(['role']).subscribe((result) => {
        expect(result).toBe(true);
        done();
      });
    });
    it('should return false if required roles are missing', (done) => {
      store.setState({
        'azure-auth': {
          accountInfo: {
            idTokenClaims: {
              roles: ['another role'],
            },
          },
        },
      });

      component.hasRequiredRoles(['role']).subscribe((result) => {
        expect(result).toBe(false);
        done();
      });
    });
  });
});
