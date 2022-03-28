import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { HOMECARD } from '../shared/constants';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let spectator: Spectator<HomeComponent>;
  let router: Router;

  const createComponent = createComponentFactory({
    component: HomeComponent,
    declarations: [HomeComponent],
    imports: [
      RouterTestingModule,
      MatCardModule,
      MatIconModule,
      MatButtonModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    router = spectator.inject(Router);

    router.navigate = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('startCalculator', () => {
    it('should trigger the router navigate to the greaseCalculationLink route', () => {
      const trackCardClickSpy = jest.spyOn(component, 'trackCardClick');

      component.startCalculator();

      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith([
        component.greaseCalculationLink,
      ]);
      expect(trackCardClickSpy).toHaveBeenCalledWith('greaseCalculation');
    });
  });

  describe('#trackCardClick', () => {
    it('should call the logEvent method', () => {
      const mockCardName = 'mockCardName';

      const trackingSpy = jest.spyOn(
        component['applicationInsightsService'],
        'logEvent'
      );

      component.trackCardClick(mockCardName);

      expect(trackingSpy).toHaveBeenCalledWith(HOMECARD, {
        card: mockCardName,
      });
    });
  });
});
