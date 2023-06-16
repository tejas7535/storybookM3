import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DataFacade } from '@mac/msd/store/facades/data';

import * as en from '../../../../../assets/i18n/en.json';
import { MsdDialogService } from '../../services';
import { EditCellRendererParams } from '../edit-cell-renderer/edit-cell-renderer-params.model';
import { GreenSteelCellRendererComponent } from './green-steel-cell-renderer.component';

describe('GreenSteelCellRendererComponent', () => {
  let component: GreenSteelCellRendererComponent;
  let spectator: Spectator<GreenSteelCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: GreenSteelCellRendererComponent,
    imports: [PushModule, provideTranslocoTestingModule({ en })],
    providers: [
      {
        provide: DataFacade,
        useValue: {
          dispatch: jest.fn(),
        },
      },
      {
        provide: MsdDialogService,
        useValue: {
          openDialog: jest.fn(),
        },
      },
    ],
  });

  const mockparams = {
    value: 77,
    hasEditorRole: false,
  } as EditCellRendererParams;

  const setValue = (value?: number) => {
    component.agInit({ value } as EditCellRendererParams);
  };

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.agInit(mockparams);
  });

  describe('agInit', () => {
    it('should assign params', () => {
      const mockParams = {
        value: 22,
      } as EditCellRendererParams;

      component.agInit(mockParams);

      expect(component.params).toEqual(mockParams);
    });
  });

  describe('refresh', () => {
    it('should return false', () => {
      expect(component.refresh()).toBe(false);
    });
  });

  describe('getClassification', () => {
    it.each([
      [0, 3],
      [200, 3],
      [800, 2],
      [1200, 1],
      [1800, 0],
      [undefined, 0],
    ])('should classify co2Value of <%p> as [%p]', (co2Value, expected) => {
      setValue(co2Value);
      expect(component.getRating()).toBe(expected);
    });
  });

  describe('isValid', () => {
    it('negative values are "valid"', () => {
      setValue(-1);
      expect(component.isValid()).toBeTruthy();
    });
    it('zero values are "valid"', () => {
      setValue(0);
      expect(component.isValid()).toBeTruthy();
    });
    it('positive values are "valid"', () => {
      setValue(1);
      expect(component.isValid()).toBeTruthy();
    });
    it('null values are "invalid"', () => {
      setValue();
      expect(component.isValid()).toBeFalsy();
    });
  });
});
