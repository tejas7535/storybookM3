import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SharedModule } from '@cdba/shared';
import { BomContainerModule } from '@cdba/shared/components';

import { BomTabComponent } from './bom-tab.component';

describe('BomTabComponent', () => {
  let spectator: Spectator<BomTabComponent>;
  let component: BomTabComponent;

  const createComponent = createComponentFactory({
    component: BomTabComponent,
    imports: [
      SharedModule,
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
