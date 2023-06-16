import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import { ConfirmDeleteDialogComponent } from '@mac/msd/main-table/confirm-delete-dialog/confirm-delete-dialog.component';
import { AluminumInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/materials/aluminum/aluminum-input-dialog.component';
import { SteelInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/materials/steel/steel-input-dialog.component';
import { DataResult } from '@mac/msd/models';

import { ManufacturerSupplierInputDialogComponent } from '../../main-table/material-input-dialog/manufacturer-supplier/manufacturersupplier-input-dialog.component';
import { MaterialStandardInputDialogComponent } from '../../main-table/material-input-dialog/material-standard/material-standard-input-dialog.component';
import { CeramicInputDialogComponent } from '../../main-table/material-input-dialog/materials/ceramic/ceramic-input-dialog.component';
import { CopperInputDialogComponent } from '../../main-table/material-input-dialog/materials/copper/copper-input-dialog.component';
import { HardmagnetMaterialStandardInputDialogComponent } from '../../main-table/material-input-dialog/materials/hardmagnet/hardmagnet-material-standard-input-dialog.component';
import { MsdDialogService } from './msd-dialog.service';

describe('MsdDialogService', () => {
  let spectator: SpectatorService<MsdDialogService>;
  let service: MsdDialogService;

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
          open: jest.fn(() => ({} as unknown as MatDialogRef<any>)),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(MsdDialogService);
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
        const expected =
          mc === MaterialClass.HARDMAGNET
            ? HardmagnetMaterialStandardInputDialogComponent.name
            : MaterialStandardInputDialogComponent.name;
        expect(result).toEqual(expected);
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
});
