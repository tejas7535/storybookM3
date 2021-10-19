import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BlockUiComponent } from './block-ui.component';

describe('BlockUiComponent', () => {
  let component: BlockUiComponent;
  let spectator: Spectator<BlockUiComponent>;

  const createComponent = createComponentFactory({
    component: BlockUiComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), MatProgressBarModule],
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
