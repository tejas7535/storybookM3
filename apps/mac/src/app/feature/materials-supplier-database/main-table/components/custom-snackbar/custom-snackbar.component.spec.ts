import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../../../assets/i18n/en.json';
import { CustomSnackbarComponent } from './custom-snackbar.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string.split('.').pop()),
}));
describe('ActionCellRendererComponent', () => {
  let component: CustomSnackbarComponent;
  let spectator: Spectator<CustomSnackbarComponent>;

  const configData: any = {};

  const createComponent = createComponentFactory({
    component: CustomSnackbarComponent,
    imports: [provideTranslocoTestingModule({ en })],
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
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
      expect(component['snackBar'].dismiss).toHaveBeenCalled();
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
      component.ngOnInit();

      expect(component.items).toStrictEqual(expected);
    });

    it('should return empty list', () => {
      expect(component.items).toStrictEqual([]);
    });
  });
});
