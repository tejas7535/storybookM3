import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { BomContainerModule } from '@cdba/shared/components';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BomCompareTabComponent } from './bom-compare-tab.component';

describe('BomCompareTabComponent', () => {
  let component: BomCompareTabComponent;
  let spectator: Spectator<BomCompareTabComponent>;

  const createComponent = createComponentFactory({
    component: BomCompareTabComponent,
    imports: [
      MatCardModule,
      provideTranslocoTestingModule({ en: {} }),
      MockModule(BomContainerModule),
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
    component = spectator.component;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
