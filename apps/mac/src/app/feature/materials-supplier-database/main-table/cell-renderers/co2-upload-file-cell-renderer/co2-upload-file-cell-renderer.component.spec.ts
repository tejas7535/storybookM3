import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MsdDialogService } from '@mac/msd/services';
import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';

import * as en from '../../../../../../assets/i18n/en.json';
import { EditCellRendererParams } from '../edit-cell-renderer/edit-cell-renderer-params.model';
import { Co2UploadFileCellRendererComponent } from './co2-upload-file-cell-renderer.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual('@jsverse/transloco'),
  translate: jest.fn((key) => key),
}));

describe('Co2UploadFileCellRendererComponent', () => {
  let component: Co2UploadFileCellRendererComponent;
  let spectator: Spectator<Co2UploadFileCellRendererComponent>;

  const initialState = {
    msd: { data: { ...initialDataState } },
  };

  const createComponent = createComponentFactory({
    component: Co2UploadFileCellRendererComponent,
    imports: [provideTranslocoTestingModule({ en })],
    providers: [
      provideMockStore({ initialState }),
      {
        provide: MsdDialogService,
        useValue: {
          openPdfDialog: jest.fn(),
        },
      },
    ],
  });

  const mockparams = {
    value: 23,
    hasEditorRole: true,
  } as EditCellRendererParams;

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    spectator.inject(MockStore);
    component.agInit(mockparams);
  });

  it('create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should set to active with value and editor role', () => {
      expect(component['params']).toBeTruthy();
      expect(component['active']).toBeTruthy();
    });
    it('should set to false without editor role', () => {
      const params = {
        ...mockparams,
        hasEditorRole: false,
      } as EditCellRendererParams;
      component.agInit(params);
      expect(component['active']).toBeFalsy();
    });
    it('should set to false without upload id available', () => {
      const params = {
        ...mockparams,
        value: undefined,
      } as EditCellRendererParams;
      component.agInit(params);
      expect(component['active']).toBeFalsy();
    });
  });

  describe('refresh', () => {
    it('should return false', () => {
      expect(component.refresh()).toBe(false);
    });
  });

  describe('openPdf', () => {
    it('should call MaterialHistory as default', () => {
      component.openPdf();
      expect(component['dialogService'].openPdfDialog).toHaveBeenCalledWith(
        mockparams.value
      );
    });
  });
});
