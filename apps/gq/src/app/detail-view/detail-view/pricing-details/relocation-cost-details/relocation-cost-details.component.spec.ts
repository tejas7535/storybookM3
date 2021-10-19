import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { LabelTextModule } from '../../../../shared/components/label-text/label-text.module';
import { SharedPipesModule } from '../../../../shared/pipes/shared-pipes.module';
import { RelocationCostDetailsComponent } from './relocation-cost-details.component';

describe('RelocationCostDetailsComponent', () => {
  let component: RelocationCostDetailsComponent;
  let spectator: Spectator<RelocationCostDetailsComponent>;

  const createComponent = createComponentFactory({
    component: RelocationCostDetailsComponent,
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
