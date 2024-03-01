import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';

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
    imports: [PushPipe, provideTranslocoTestingModule({ en })],
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
          openInfoDialog: jest.fn(),
        },
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  const mockparams = {
    value: 77,
    hasEditorRole: false,
  } as EditCellRendererParams;

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
});
