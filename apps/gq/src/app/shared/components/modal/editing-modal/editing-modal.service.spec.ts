import { MatDialog } from '@angular/material/dialog';

import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
  SpyObject,
} from '@ngneat/spectator/jest';

import { QUOTATION_DETAIL_MOCK } from '../../../../../testing/mocks';
import { EditingModalService } from './editing-modal.service';
import { EditingModalWrapperComponent } from './editing-modal-wrapper/editing-modal-wrapper.component';

jest.mock('./editing-modal.component', () => ({
  EditingModalComponent: jest.fn(),
}));

describe('EditingModalService', () => {
  let service: EditingModalService;
  let spectator: SpectatorService<EditingModalService>;
  let matDialog: SpyObject<MatDialog>;
  const panelClass = 'editing-modal';

  const createService = createServiceFactory({
    service: EditingModalService,
    providers: [mockProvider(MatDialog)],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    matDialog = spectator.inject(MatDialog);
  });

  test('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should open gpi editing modal', () => {
    const data = {
      field: ColumnFields.GPI,
      quotationDetail: QUOTATION_DETAIL_MOCK,
    };

    service.openEditingModal(data);

    expect(matDialog.open).toBeCalledWith(EditingModalWrapperComponent, {
      width: '684px',
      data,
      panelClass,
    });
  });
});
