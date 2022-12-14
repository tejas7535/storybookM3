import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import { AluminumInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/materials/aluminum/aluminum-input-dialog.component';
import { SteelInputDialogComponent } from '@mac/msd/main-table/material-input-dialog/materials/steel/steel-input-dialog.component';
import { DataResult } from '@mac/msd/models';

import { ManufacturerSupplierInputDialogComponent } from '../../main-table/material-input-dialog/manufacturer-supplier/manufacturersupplier-input-dialog.component';
import { MaterialStandardInputDialogComponent } from '../../main-table/material-input-dialog/material-standard/material-standard-input-dialog.component';
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

  describe('getDialogClass', () => {
    it('should return the dialog class for default', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(JSON.stringify(service['getDialogClass']())).toEqual(
        JSON.stringify(SteelInputDialogComponent)
      );
    });

    it('should return the dialog class for aluminum', () => {
      expect(
        JSON.stringify(service['getDialogClass'](MaterialClass.ALUMINUM))
      ).toEqual(JSON.stringify(AluminumInputDialogComponent));
    });
    it('should return the dialog class for steel', () => {
      expect(
        JSON.stringify(service['getDialogClass'](MaterialClass.STEEL))
      ).toEqual(JSON.stringify(SteelInputDialogComponent));
    });
    it('should return the dialog class for polymer', () => {
      expect(
        JSON.stringify(service['getDialogClass'](MaterialClass.POLYMER))
      ).toEqual(JSON.stringify(SteelInputDialogComponent));
    });
    it('should return the dialog class for steel material', () => {
      expect(
        JSON.stringify(
          service['getDialogClass'](
            MaterialClass.STEEL,
            NavigationLevel.MATERIAL
          )
        )
      ).toEqual(JSON.stringify(SteelInputDialogComponent));
    });
    it('should return the dialog class for aluminum material', () => {
      expect(
        JSON.stringify(
          service['getDialogClass'](
            MaterialClass.ALUMINUM,
            NavigationLevel.MATERIAL
          )
        )
      ).toEqual(JSON.stringify(AluminumInputDialogComponent));
    });
    it('should return the dialog class for polymer material', () => {
      expect(
        JSON.stringify(
          service['getDialogClass'](
            MaterialClass.POLYMER,
            NavigationLevel.MATERIAL
          )
        )
      ).toEqual(JSON.stringify(SteelInputDialogComponent));
    });

    it('should return the dialog class for steel material standard', () => {
      expect(
        JSON.stringify(
          service['getDialogClass'](
            MaterialClass.STEEL,
            NavigationLevel.STANDARD
          )
        )
      ).toEqual(JSON.stringify(MaterialStandardInputDialogComponent));
    });
    it('should return the dialog class for aluminum material standard', () => {
      expect(
        JSON.stringify(
          service['getDialogClass'](
            MaterialClass.ALUMINUM,
            NavigationLevel.STANDARD
          )
        )
      ).toEqual(JSON.stringify(MaterialStandardInputDialogComponent));
    });
    it('should return the dialog class for polymer material standard', () => {
      expect(
        JSON.stringify(
          service['getDialogClass'](
            MaterialClass.POLYMER,
            NavigationLevel.STANDARD
          )
        )
      ).toEqual(JSON.stringify(MaterialStandardInputDialogComponent));
    });

    it('should return the dialog class for steel supplier', () => {
      expect(
        JSON.stringify(
          service['getDialogClass'](
            MaterialClass.STEEL,
            NavigationLevel.SUPPLIER
          )
        )
      ).toEqual(JSON.stringify(ManufacturerSupplierInputDialogComponent));
    });
    it('should return the dialog class for aluminum supplier', () => {
      expect(
        JSON.stringify(
          service['getDialogClass'](
            MaterialClass.ALUMINUM,
            NavigationLevel.SUPPLIER
          )
        )
      ).toEqual(JSON.stringify(ManufacturerSupplierInputDialogComponent));
    });
    it('should return the dialog class for polymer supplier', () => {
      expect(
        JSON.stringify(
          service['getDialogClass'](
            MaterialClass.POLYMER,
            NavigationLevel.SUPPLIER
          )
        )
      ).toEqual(JSON.stringify(ManufacturerSupplierInputDialogComponent));
    });
  });
});
