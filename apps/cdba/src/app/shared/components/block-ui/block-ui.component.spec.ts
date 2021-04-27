import { MatProgressBarModule } from '@angular/material/progress-bar';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { BlockUiComponent } from './block-ui.component';

describe('BlockUiComponent', () => {
  let component: BlockUiComponent;
  let spectator: Spectator<BlockUiComponent>;

  const createComponent = createComponentFactory({
    component: BlockUiComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), MatProgressBarModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
