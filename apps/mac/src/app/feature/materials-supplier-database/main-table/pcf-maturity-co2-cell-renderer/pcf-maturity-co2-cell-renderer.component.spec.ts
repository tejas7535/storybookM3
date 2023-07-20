import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../../assets/i18n/en.json';
import { MsdDialogService } from '../../services';
import { EditCellRendererParams } from '../edit-cell-renderer/edit-cell-renderer-params.model';
import { PcfMaturityCo2CellRendererComponent } from './pcf-maturity-co2-cell-renderer.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string),
}));

describe('PcfMaturityCo2CellRendererComponent', () => {
  let component: PcfMaturityCo2CellRendererComponent;
  let spectator: Spectator<PcfMaturityCo2CellRendererComponent>;

  const createComponent = createComponentFactory({
    component: PcfMaturityCo2CellRendererComponent,
    imports: [provideTranslocoTestingModule({ en })],
    providers: [
      {
        provide: MsdDialogService,
        useValue: {
          openDialog: jest.fn(),
          openInfoDialog: jest.fn(),
        },
      },
    ],
  });

  const mockparams = {
    value: 77,
    data: { maturity: 9 },
  } as EditCellRendererParams;

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.agInit(mockparams);
  });

  describe('create', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('refresh', () => {
    it('should return false', () => {
      expect(component.refresh()).toBe(false);
    });
  });

  describe('hasValue', () => {
    it('should return true for any int', () => {
      component.params.value = 7;
      expect(component.hasValue()).toBeTruthy();
    });
    it('should return false for undefined', () => {
      component.params.value = undefined;
      expect(component.hasValue()).toBeFalsy();
    });
    it('should return true for 0', () => {
      component.params.value = 0;
      expect(component.hasValue()).toBeTruthy();
    });
    it('should return false without params', () => {
      component.params = undefined;
      expect(component.hasValue()).toBeFalsy();
    });
  });

  describe('getMaturity', () => {
    it('should return set maturity', () => {
      expect(component.getMaturity()).toBe(9);
    });
  });

  describe('openMoreInformation', () => {
    it('should open the dialog', () => {
      component.openMoreInformation();

      expect(component['dialogService'].openInfoDialog).toHaveBeenCalledWith(
        'materialsSupplierDatabase.mainTable.tooltip.maturity.moreInformationTitle',
        undefined,
        'materialsSupplierDatabase.mainTable.tooltip.maturity.moreInformationImg',
        undefined,
        undefined,
        'materialsSupplierDatabase.mainTable.tooltip.maturity.moreInformationContact',
        'materialsSupplierDatabase.mainTable.tooltip.maturity.moreInformationContactLink',
        component.bottomTextTemplate
      );
    });
  });
});
