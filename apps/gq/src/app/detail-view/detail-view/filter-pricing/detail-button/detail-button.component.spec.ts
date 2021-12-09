import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SharedPipesModule } from '../../../../shared/pipes/shared-pipes.module';
import { FilterPricingCardComponent } from '../filter-pricing-card/filter-pricing-card.component';
import { QuantityDisplayComponent } from '../quantity/quantity-display/quantity-display.component';
import { DetailButtonComponent } from './detail-button.component';

describe('DetailButtonComponent', () => {
  let component: DetailButtonComponent;
  let spectator: Spectator<DetailButtonComponent>;
  let router: Router;

  const createComponent = createComponentFactory({
    component: DetailButtonComponent,
    detectChanges: false,
    imports: [
      MatCardModule,
      MatIconModule,
      ReactiveComponentModule,
      RouterTestingModule,
      SharedPipesModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    declarations: [
      DetailButtonComponent,
      FilterPricingCardComponent,
      QuantityDisplayComponent,
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    router = spectator.inject(Router);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navigateClick', () => {
    test('should navigate to the given path', () => {
      router.navigate = jest.fn();
      component.path = 'path';

      component.navigateClick();

      expect(router.navigate).toHaveBeenCalledWith(['detail-view/path'], {
        queryParamsHandling: 'preserve',
      });
    });
  });
});
