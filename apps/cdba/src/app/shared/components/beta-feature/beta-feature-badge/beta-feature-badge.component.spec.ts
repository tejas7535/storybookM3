import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogModule as MatDialogModule,
} from '@angular/material/legacy-dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SpyObject } from '@ngneat/spectator/jest/lib/mock.js';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BetaFeatureBadgeComponent } from './beta-feature-badge.component';

describe('BetaFeatureBadgeComponent', () => {
  let component: BetaFeatureBadgeComponent;
  let spectator: Spectator<BetaFeatureBadgeComponent>;
  let betaFeatureDialog: SpyObject<MatDialog>;

  const createComponent = createComponentFactory({
    component: BetaFeatureBadgeComponent,
    imports: [MatDialogModule, provideTranslocoTestingModule({ en: {} })],
    mocks: [MatDialog],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    betaFeatureDialog = spectator.inject(MatDialog);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test(
    'should open beta-feature dialog on button click',
    marbles(() => {
      component.onBadgeClick({ target: { blur: jest.fn() } });

      expect(betaFeatureDialog.open).toHaveBeenCalled();
    })
  );
});
