import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../../assets/i18n/en.json';
import { EditCellRendererParams } from '../edit-cell-renderer/edit-cell-renderer-params.model';
import { PcfMaturityCo2CellRendererComponent } from './pcf-maturity-co2-cell-renderer.component';

describe('PcfMaturityCo2CellRendererComponent', () => {
  let component: PcfMaturityCo2CellRendererComponent;
  let spectator: Spectator<PcfMaturityCo2CellRendererComponent>;

  const createComponent = createComponentFactory({
    component: PcfMaturityCo2CellRendererComponent,
    imports: [provideTranslocoTestingModule({ en })],
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
});
