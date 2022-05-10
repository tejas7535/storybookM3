import { MatButtonModule } from '@angular/material/button';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ToggleSplitTypeButtonComponent } from './toggle-split-type-button.component';

describe('ToggleSplitTypeButtonComponent', () => {
  let spectator: Spectator<ToggleSplitTypeButtonComponent>;
  const createComponent = createComponentFactory({
    component: ToggleSplitTypeButtonComponent,
    imports: [MatButtonModule, provideTranslocoTestingModule({ en: {} })],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
