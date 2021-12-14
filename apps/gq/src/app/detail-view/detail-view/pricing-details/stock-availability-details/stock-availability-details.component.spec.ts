import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { LabelTextModule } from '../../../../shared/components/label-text/label-text.module';
import { SharedPipesModule } from '../../../../shared/pipes/shared-pipes.module';
import { StockAvailabilityDetailsComponent } from './stock-availability-details.component';

describe('StockAvailabilityDetailsComponent', () => {
  let component: StockAvailabilityDetailsComponent;
  let spectator: Spectator<StockAvailabilityDetailsComponent>;

  const createComponent = createComponentFactory({
    component: StockAvailabilityDetailsComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      ReactiveComponentModule,
      SharedPipesModule,
      MatCardModule,
      LabelTextModule,
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
