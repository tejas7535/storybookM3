import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CustomSnackbarComponent } from './custom-snackbar.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string.split('.').pop()),
}));
describe('ActionCellRendererComponent', () => {
  let component: CustomSnackbarComponent;
  let spectator: Spectator<CustomSnackbarComponent>;

  const configData: any = {};

  const createComponent = createComponentFactory({
    component: CustomSnackbarComponent,
    imports: [MatIconModule, CommonModule, SharedTranslocoModule],
    providers: [
      {
        provide: MatSnackBarRef,
        useValue: {
          dismiss: jest.fn(),
        },
      },
      {
        provide: MAT_SNACK_BAR_DATA,
        useValue: configData,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('hasDetail', () => {
    it('should not have detail', () => {
      expect(component.hasDetail()).toBeFalsy();
    });
    it('should have detail', () => {
      configData.detail = 'somedata';

      expect(component.hasDetail()).toBeTruthy();
    });
  });

  describe('toggleDetails', () => {
    it('should toggle false > true', () => {
      expect(component.visibleDetails).toBeFalsy();
      component.toggleDetails();
      expect(component.visibleDetails).toBeTruthy();
    });
    it('should toggle false > true > false', () => {
      expect(component.visibleDetails).toBeFalsy();
      component.toggleDetails();
      component.toggleDetails();
      expect(component.visibleDetails).toBeFalsy();
    });
  });

  describe('close', () => {
    it('should dissmiss the snackbar', () => {
      component['snackBar'].dismiss = jest.fn();
      component.close();
      expect(component['snackBar'].dismiss).toBeCalled();
    });
  });

  describe('getItems', () => {
    afterEach(() => {
      configData.detail = undefined;
    });
    it('should get list of translated keys and values', () => {
      const src = { a: 1, b: 2 };
      const expected = src;
      configData.detail = {
        items: src,
      };

      expect(component.getItems()).toStrictEqual(expected);
    });

    it('should return empty list', () => {
      expect(component.getItems()).toStrictEqual([]);
    });
  });
});
