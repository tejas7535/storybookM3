import { MatCardModule } from '@angular/material/card';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';
import { NgxEchartsModule } from 'ngx-echarts';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BomContainerModule } from '@cdba/shared/components';

import { BomCompareTabComponent } from './bom-compare-tab.component';

describe('BomCompareTabComponent', () => {
  let component: BomCompareTabComponent;
  let spectator: Spectator<BomCompareTabComponent>;

  const createComponent = createComponentFactory({
    component: BomCompareTabComponent,
    imports: [
      MatCardModule,
      NgxEchartsModule,
      provideTranslocoTestingModule({ en: {} }),
      MockModule(BomContainerModule),
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
