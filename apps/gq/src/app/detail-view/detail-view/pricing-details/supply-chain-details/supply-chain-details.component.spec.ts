import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SupplyChainDetailsComponent } from './supply-chain-details.component';

describe('SupplyChainDetailsComponent', () => {
  let component: SupplyChainDetailsComponent;
  let spectator: Spectator<SupplyChainDetailsComponent>;

  const createComponent = createComponentFactory({
    component: SupplyChainDetailsComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      PushPipe,
      SharedPipesModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
