import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PcmBadgeComponent } from './pcm-badge.component';

describe('PcmBadgeComponent', () => {
  let component: PcmBadgeComponent;
  let spectator: Spectator<PcmBadgeComponent>;

  const createComponent = createComponentFactory({
    component: PcmBadgeComponent,
    imports: [
      MockModule(MatTooltipModule),
      provideTranslocoTestingModule({ en: {} }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
