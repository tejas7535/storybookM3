import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BetaFeatureDialogComponent } from './beta-feature-dialog.component';

describe('BetaFeatureDialogComponent', () => {
  let component: BetaFeatureDialogComponent;
  let spectator: Spectator<BetaFeatureDialogComponent>;

  const createComponent = createComponentFactory({
    component: BetaFeatureDialogComponent,
    imports: [MatIconModule, provideTranslocoTestingModule({ en: {} })],
    providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
