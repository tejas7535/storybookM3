import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedModule } from '@cdba/shared';
import { BomContainerModule } from '@cdba/shared/components';

import { BomCompareTabComponent } from './bom-compare-tab.component';

describe('BomCompareTabComponent', () => {
  let component: BomCompareTabComponent;
  let spectator: Spectator<BomCompareTabComponent>;

  const createComponent = createComponentFactory({
    component: BomCompareTabComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      SharedModule,
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
