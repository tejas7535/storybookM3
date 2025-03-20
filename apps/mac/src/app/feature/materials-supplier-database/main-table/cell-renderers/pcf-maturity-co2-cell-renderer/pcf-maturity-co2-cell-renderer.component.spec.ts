import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { Subject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent, MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { HtmlTooltipComponent } from '@mac/shared/components/html-tooltip/html-tooltip.component';

import * as en from '../../../../../../assets/i18n/en.json';
import { EditCellRendererParams } from '../edit-cell-renderer/edit-cell-renderer-params.model';
import { PcfMaturityCo2CellRendererComponent } from './pcf-maturity-co2-cell-renderer.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual('@jsverse/transloco'),
  translate: jest.fn((key) => key),
}));

describe('PcfMaturityCo2CellRendererComponent', () => {
  let component: PcfMaturityCo2CellRendererComponent;
  let spectator: Spectator<PcfMaturityCo2CellRendererComponent>;

  const mockparams = {
    value: undefined,
    data: { maturity: 0 },
  } as EditCellRendererParams;

  const sub = new Subject();

  const createComponent = createComponentFactory({
    component: PcfMaturityCo2CellRendererComponent,
    declarations: [MockComponent(HtmlTooltipComponent)],
    imports: [provideTranslocoTestingModule({ en })],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
      provideMockStore({}),
      MockProvider(DataFacade, { hasMatnrUploaderRole$: sub }, 'useValue'),
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.agInit(mockparams);
    spectator.detectChanges();
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

  describe('hideValue', () => {
    const testParams = { ...mockparams };
    it('should not hide value for undefined value', () => {
      expect(component.hideValue).toBeFalsy();
    });
    it('should display with high maturity', () => {
      testParams.value = 7;
      testParams.data['maturity'] = 10;
      component.agInit(testParams);
      expect(component.hideValue).toBeFalsy();
    });
    it('should not hide with high maturity for zero', () => {
      // 0 is a valid value (!!0 = false)
      testParams.value = 0;
      testParams.data['maturity'] = 10;
      component.agInit(testParams);
      expect(component.hideValue).toBeFalsy();
    });

    it('should display value with low maturity for uploader', () => {
      testParams.value = 50;
      testParams.data['maturity'] = 1;
      sub.next(true);
      component.agInit(testParams);
      expect(component.hideValue).toBeFalsy();
    });
    it('should hide value with low maturity for others', () => {
      testParams.value = 50;
      testParams.data['maturity'] = 1;
      sub.next(false);
      component.agInit(testParams);
      expect(component.hideValue).toBeFalsy();
    });
  });
});
