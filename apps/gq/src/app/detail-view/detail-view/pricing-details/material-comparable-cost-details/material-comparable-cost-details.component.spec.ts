import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { LabelTextModule } from '../../../../shared/components/label-text/label-text.module';
import { SharedPipesModule } from '../../../../shared/pipes/shared-pipes.module';
import { MaterialComparableCostDetailsComponent } from './material-comparable-cost-details.component';

describe('MaterialComparableCostDetailsComponent', () => {
  let component: MaterialComparableCostDetailsComponent;
  let spectator: Spectator<MaterialComparableCostDetailsComponent>;

  const createComponent = createComponentFactory({
    component: MaterialComparableCostDetailsComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      SharedPipesModule,
      PushModule,
      MatCardModule,
      LabelTextModule,
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({ initialState: { materialComparableCosts: {} } }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
