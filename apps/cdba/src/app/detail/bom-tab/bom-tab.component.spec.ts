import { BomContainerModule } from '@cdba/shared/components';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BomTabComponent } from './bom-tab.component';

describe('BomTabComponent', () => {
  let spectator: Spectator<BomTabComponent>;
  let component: BomTabComponent;

  const createComponent = createComponentFactory({
    component: BomTabComponent,
    imports: [
      MockModule(BomContainerModule),
      provideTranslocoTestingModule({ en: {} }),
    ],
    disableAnimations: true,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
