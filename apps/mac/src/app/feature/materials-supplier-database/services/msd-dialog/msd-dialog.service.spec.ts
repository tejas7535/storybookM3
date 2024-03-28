import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';

import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import { ConfirmDeleteDialogComponent } from '@mac/msd/main-table/confirm-delete-dialog/confirm-delete-dialog.component';
import { AluminumInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/materials/aluminum/aluminum-input-dialog.component';
import { SteelInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/materials/steel/steel-input-dialog.component';
import { DataResult } from '@mac/msd/models';

import { ManufacturerSupplierInputDialogComponent } from '../../main-table/material-input-dialog/manufacturer-supplier/manufacturersupplier-input-dialog.component';
import { MaterialStandardInputDialogComponent } from '../../main-table/material-input-dialog/material-standard/material-standard-input-dialog.component';
import { CeramicInputDialogComponent } from '../../main-table/material-input-dialog/materials/ceramic/ceramic-input-dialog.component';
import { CopperInputDialogComponent } from '../../main-table/material-input-dialog/materials/copper/copper-input-dialog.component';
import { SapMaterialsUploadDialogComponent } from '../../main-table/material-input-dialog/materials/sap/sap-materials-upload-dialog.component';
import { SapMaterialsUploadStatusDialogComponent } from '../../main-table/material-input-dialog/materials/sap/sap-materials-upload-status-dialog/sap-materials-upload-status-dialog.component';
import { ReferenceDocumentBulkEditDialogComponent } from '../../main-table/material-input-dialog/materials/steel/reference-document-bulk-edit-dialog/reference-document-bulk-edit-dialog.component';
import { MoreInformationDialogComponent } from '../../main-table/more-information-dialog/more-information-dialog.component';
import { MsdDialogService } from './msd-dialog.service';

@Injectable()
class MockDataFacade extends DataFacade {
  openMultiEditDialog = jest.fn();
}

describe('MsdDialogService', () => {
  let spectator: SpectatorService<MsdDialogService>;
  let service: MsdDialogService;
  let dataFacade: DataFacade;

  const initialState = {
    msd: {
      data: {
        navigation: {
          materialClass: 'st',
          navigationLevel: 'materials',
        },
      },
      dialog: {},
      quickfilter: {},
    },
  };

  const createService = createServiceFactory({
    service: MsdDialogService,
    providers: [
      provideMockStore({ initialState }),
      {
        provide: MatDialog,
        useValue: {
          open: jest.fn(() => ({}) as unknown as MatDialogRef<any>),
        },
      },
      MockProvider(DataFacade, MockDataFacade, 'useClass'),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;

    dataFacade = spectator.inject(DataFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openDialog', () => {
    it('should open the dialog', () => {
      const mockRef = service.openDialog(true, {
        row: {} as DataResult,
        column: 'column',
      });
      service['getDialogClass'] = jest.fn(() => SteelInputDialogComponent);

      expect(mockRef).toEqual({} as unknown as MatDialogRef<any>);
      expect(service['dialog'].open).toHaveBeenCalledWith(
        SteelInputDialogComponent,
        {
          width: '863px',
          autoFocus: false,
          restoreFocus: false,
          disableClose: true,
          data: {
            editDialogInformation: { row: {} as DataResult, column: 'column' },
            isResumeDialog: true,
          },
        }
      );
    });
  });

  describe('getDialogClass Material', () => {
    const getDialogClass = (mc?: MaterialClass) =>
      service['getDialogClass'](mc, NavigationLevel.MATERIAL).name;

    it('should return the default dialog without arguments', () => {
      expect(service['getDialogClass']().name).toBe(
        SteelInputDialogComponent.name
      );
    });

    it('should return the default dialog without navigation level', () => {
      expect(service['getDialogClass'](MaterialClass.ALUMINUM).name).toBe(
        SteelInputDialogComponent.name
      );
    });

    it('should return the dialog class for aluminum', () => {
      expect(getDialogClass(MaterialClass.ALUMINUM)).toBe(
        AluminumInputDialogComponent.name
      );
    });
    it('should return the dialog class for steel', () => {
      expect(getDialogClass(MaterialClass.STEEL)).toBe(
        SteelInputDialogComponent.name
      );
    });
    it('should return the dialog class for copper', () => {
      expect(getDialogClass(MaterialClass.COPPER)).toBe(
        CopperInputDialogComponent.name
      );
    });
    it('should return the dialog class for polymer', () => {
      expect(getDialogClass(MaterialClass.POLYMER)).toBe(
        SteelInputDialogComponent.name
      );
    });
    it('should return the dialog class for ceramic', () => {
      expect(getDialogClass(MaterialClass.CERAMIC)).toBe(
        CeramicInputDialogComponent.name
      );
    });
  });

  describe('getDialogClass MaterialStandard', () => {
    it.each(Object.values(MaterialClass))(
      'should return matstd dialog for any material - %p',
      (mc) => {
        const result = service['getDialogClass'](
          mc,
          NavigationLevel.STANDARD
        ).name;
        expect(result).toEqual(MaterialStandardInputDialogComponent.name);
      }
    );
  });
  describe('getDialogClass Supplier', () => {
    it.each(Object.values(MaterialClass))(
      'should return matstd dialog for any material - %p',
      (mc) => {
        const result = service['getDialogClass'](
          mc,
          NavigationLevel.SUPPLIER
        ).name;
        expect(result).toEqual(ManufacturerSupplierInputDialogComponent.name);
      }
    );
  });

  describe('openConfirmDeleteDialog', () => {
    it('should open the dialog', () => {
      const mockRef = service.openConfirmDeleteDialog();

      expect(mockRef).toEqual({} as unknown as MatDialogRef<any>);
      expect(service['dialog'].open).toHaveBeenCalledWith(
        ConfirmDeleteDialogComponent,
        {
          width: '500px',
          autoFocus: false,
        }
      );
    });
  });

  describe('open dialog MultiEdit', () => {
    it('should open the dialog', () => {
      const dr: DataResult = {} as DataResult;
      service.openDialog = jest.fn();
      service['combineRows'] = jest.fn<any, any>(() => ({}));
      const selectedRows = [{ data: dr }, { data: dr }];

      service.openBulkEditDialog(selectedRows);

      expect(dataFacade.openMultiEditDialog).toHaveBeenCalledWith([dr, dr], dr);
      expect(service.openDialog).toBeCalledWith(false, {
        row: dr,
        column: undefined,
        isCopy: false,
        isBulkEdit: true,
        selectedRows: [dr, dr],
      });
    });
  });

  describe('openInfoDialog', () => {
    it('should open the dialog', () => {
      service.openInfoDialog(
        'test',
        'test',
        'test',
        'test',
        'test',
        'test',
        'test'
      );

      expect(service['dialog'].open).toHaveBeenCalledWith(
        MoreInformationDialogComponent,
        {
          data: {
            title: 'test',
            topText: 'test',
            imageSrc: 'test',
            imageCaption: 'test',
            bottomText: 'test',
            contact: 'test',
            mailToLink: 'test',
          },
          autoFocus: false,
        }
      );
    });
  });

  describe('openSapMaterialsUploadDialog', () => {
    it('should open the dialog', () => {
      service.openSapMaterialsUploadDialog();

      expect(service['dialog'].open).toBeCalledWith(
        SapMaterialsUploadDialogComponent,
        {
          width: '634px',
          autoFocus: false,
          restoreFocus: false,
          disableClose: true,
        }
      );
    });
  });

  describe('openSapMaterialsUploadStatusDialog', () => {
    it('should open the dialog', () => {
      service.openSapMaterialsUploadStatusDialog();

      expect(service['dialog'].open).toBeCalledWith(
        SapMaterialsUploadStatusDialogComponent,
        {
          width: '710px',
          autoFocus: false,
          restoreFocus: false,
          disableClose: true,
        }
      );
    });
  });

  describe('openReferenceDocumentBulkEditDialog', () => {
    it('should open the dialog', () => {
      const selectedRows = [{ id: 1 }, { id: 2 }] as DataResult[];

      service.openReferenceDocumentBulkEditDialog(selectedRows);

      expect(service['dialog'].open).toHaveBeenCalledWith(
        ReferenceDocumentBulkEditDialogComponent,
        {
          width: '863px',
          autoFocus: false,
          restoreFocus: false,
          disableClose: true,
          data: {
            selectedRows,
          },
        }
      );
    });
  });

  describe('combineRows', () => {
    it('should combine rows', () => {
      interface Temp {
        a: number;
        b?: number;
        c?: number;
      }

      const rows: Temp[] = [
        {
          a: 1,
          b: 2,
          c: 3,
        },
        {
          a: 1,
          b: 2,
        },
        {
          a: 1,
          c: 3,
        },
      ];
      const expected: Temp = {
        a: 1,
        b: undefined,
        c: undefined,
      };

      expect(service['combineRows'](rows)).toStrictEqual(expected);
    });
    it('should combine rows with array', () => {
      interface Temp {
        a: number;
        b?: number[];
        c?: number[];
      }

      const rows: Temp[] = [
        {
          a: 1,
          b: [1, 2],
          c: [3],
        },
        {
          a: 2,
          b: [1, 2],
          c: [2, 3],
        },
        {
          a: 3,
          b: [1, 2],
          c: [1, 2],
        },
      ];
      const expected: Temp = {
        a: undefined,
        b: [1, 2],
        c: undefined,
      };

      expect(service['combineRows'](rows)).toStrictEqual(expected);
    });
  });
});
