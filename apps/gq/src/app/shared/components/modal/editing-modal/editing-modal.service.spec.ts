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
import { DiscountEditingModalComponent } from './modals/discount-editing-modal.component';
import { GpiEditingModalComponent } from './modals/gpi-editing-modal.component';
import { GpmEditingModalComponent } from './modals/gpm-editing-modal.component';
import { PriceEditingModalComponent } from './modals/price-editing-modal.component';
import { QuantityEditingModalComponent } from './modals/quantity-editing-modal.component';
import { TargetPriceEditingModalComponent } from './modals/target-price-editing-modal.component';

jest.mock('./editing-modal.component', () => ({
  EditingModalComponent: jest.fn(),
}));

describe('EditingModalService', () => {
  let service: EditingModalService;
  let spectator: SpectatorService<EditingModalService>;
  let matDialog: SpyObject<MatDialog>;

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

    expect(matDialog.open).toBeCalledWith(GpiEditingModalComponent, {
      width: '684px',
      data,
    });
  });

  it('should open gpm editing modal', () => {
    const data = {
      field: ColumnFields.GPM,
      quotationDetail: QUOTATION_DETAIL_MOCK,
    };

    service.openEditingModal(data);

    expect(matDialog.open).toBeCalledWith(GpmEditingModalComponent, {
      width: '684px',
      data,
    });
  });

  it('should open discount editing modal', () => {
    const data = {
      field: ColumnFields.DISCOUNT,
      quotationDetail: QUOTATION_DETAIL_MOCK,
    };

    service.openEditingModal(data);

    expect(matDialog.open).toBeCalledWith(DiscountEditingModalComponent, {
      width: '684px',
      data,
    });
  });

  it('should open price editing modal', () => {
    const data = {
      field: ColumnFields.PRICE,
      quotationDetail: QUOTATION_DETAIL_MOCK,
    };

    service.openEditingModal(data);

    expect(matDialog.open).toBeCalledWith(PriceEditingModalComponent, {
      width: '684px',
      data,
    });
  });

  it('should open target price editing modal', () => {
    const data = {
      field: ColumnFields.TARGET_PRICE,
      quotationDetail: QUOTATION_DETAIL_MOCK,
    };

    service.openEditingModal(data);

    expect(matDialog.open).toBeCalledWith(TargetPriceEditingModalComponent, {
      width: '684px',
      data,
    });
  });

  it('should open quantity editing modal', () => {
    const data = {
      field: ColumnFields.ORDER_QUANTITY,
      quotationDetail: QUOTATION_DETAIL_MOCK,
    };

    service.openEditingModal(data);

    expect(matDialog.open).toBeCalledWith(QuantityEditingModalComponent, {
      width: '684px',
      data,
    });
  });
});
