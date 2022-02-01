import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SpyObject } from '@ngneat/spectator/jest/lib/mock.js';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ExcludedCalculationsButtonComponent } from './excluded-calculations-button.component';

describe('ExcludedCalculationsButtonComponent', () => {
  let component: ExcludedCalculationsButtonComponent;
  let spectator: Spectator<ExcludedCalculationsButtonComponent>;
  let excludedCalculationsDialog: SpyObject<MatDialog>;

  const createComponent = createComponentFactory({
    component: ExcludedCalculationsButtonComponent,
    imports: [MatDialogModule, provideTranslocoTestingModule({ en: {} })],
    mocks: [MatDialog],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    excludedCalculationsDialog = spectator.inject(MatDialog);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test(
    'should open excluded-calculations dialog on button click',
    marbles(() => {
      component.onButtonClick({ target: { blur: jest.fn() } });

      expect(excludedCalculationsDialog.open).toHaveBeenCalled();
    })
  );
});
