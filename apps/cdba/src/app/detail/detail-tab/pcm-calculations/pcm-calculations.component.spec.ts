import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PcmCalculationsComponent } from './pcm-calculations.component';

describe('PcmCalculationsComponent', () => {
  let component: PcmCalculationsComponent;
  let spectator: Spectator<PcmCalculationsComponent>;

  const createComponent = createComponentFactory({
    component: PcmCalculationsComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
