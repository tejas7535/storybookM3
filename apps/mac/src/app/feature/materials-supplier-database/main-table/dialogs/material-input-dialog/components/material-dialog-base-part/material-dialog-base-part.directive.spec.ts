import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  QueryList,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { TranslocoModule } from '@jsverse/transloco';
import {
  createDirectiveFactory,
  SpectatorDirective,
} from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { StringOption } from '@schaeffler/inputs';

import * as utils from '../../util';
import { Co2ComponentComponent } from '../co2-component/co2-component.component';
import { ManufacturerSupplierComponent } from '../manufacturer-supplier/manufacturer-supplier.component';
import { MaterialStandardComponent } from '../material-standard/material-standard.component';
import { MaterialDialogBasePartDirective } from './material-dialog-base-part.directive';

jest.mock('../../util', () => ({
  ...jest.requireActual('../../util'),
  focusSelectedElement: jest.fn(),
}));

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string.split('.').pop()),
}));

@Component({
  template: `<div macMaterialDialogBasePart></div>`,
})
class HostComponent {
  public co2Scope1Control = new FormControl<number>(0);
  public co2Scope2Control = new FormControl<number>(0);
  public co2Scope3Control = new FormControl<number>(0);
  public co2TotalControl = new FormControl<number>(1);
  public co2ClassificationControl = new FormControl<StringOption>(undefined);
  public releaseRestrictionsControl = new FormControl<string>(undefined);

  public manufacturerSupplierControl = new FormControl<number>(1);
  public supplierControl = new FormControl<StringOption>(undefined);
  public supplierPlantControl = new FormControl<StringOption>(undefined);
  public supplierCountryControl = new FormControl<StringOption>(undefined);

  public materialStandardIdControl = new FormControl<number>(1);
  public standardDocumentsControl = new FormControl<StringOption>(undefined);
  public materialNamesControl = new FormControl<StringOption>(undefined);
}

describe('MaterialDialogBasePartDirective', () => {
  let spectator: SpectatorDirective<MaterialDialogBasePartDirective>;
  let directive: MaterialDialogBasePartDirective;

  let mockFocus: any;

  const mockCdRef = {} as unknown as ChangeDetectorRef;

  const createDirective = createDirectiveFactory({
    directive: MaterialDialogBasePartDirective,
    imports: [
      MockComponent(Co2ComponentComponent),
      MockComponent(ManufacturerSupplierComponent),
      MockComponent(MaterialStandardComponent),
    ],
    declarations: [MaterialDialogBasePartDirective, HostComponent],
    providers: [
      {
        provide: ChangeDetectorRef,
        useValue: mockCdRef,
      },
    ],
    template: `<div macMaterialDialogBasePart></div>`,
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('empty', () => {
    beforeEach(() => {
      spectator = createDirective();
      directive = spectator.directive;

      mockFocus = jest.spyOn(utils, 'focusSelectedElement');
    });

    describe('ngOnInit', () => {
      it('should initialize', () => {
        jest.advanceTimersByTime(1000);

        expect(directive).toBeTruthy();
        expect(directive['host']).toBe(undefined);
      });
    });

    describe('ngAfterViewInit', () => {
      it('should do nothing', () => {
        jest.advanceTimersByTime(1000);

        expect(mockFocus).not.toHaveBeenCalled();
      });
    });
  });

  describe('co2 directive', () => {
    const mockList = [] as unknown as QueryList<ElementRef>;
    beforeEach(() => {
      spectator = createDirective(
        `
            <mac-co2-component
            [co2Scope1Control]="co2Scope1Control"
            [co2Scope2Control]="co2Scope2Control"
            [co2Scope3Control]="co2Scope3Control"
            [co2TotalControl]="co2TotalControl"
            [co2ClassificationControl]="co2ClassificationControl"
            [releaseRestrictionsControl]="releaseRestrictionsControl"
            column="col"
            macMaterialDialogBasePart
          ></mac-co2-component>
            `
      );
      directive = spectator.directive;

      directive['host'].dialogControlRefs = mockList;
    });

    describe('ngOnInit', () => {
      it('should initialize', () => {
        jest.advanceTimersByTime(1000);

        expect(directive).toBeTruthy();
        expect(directive['host']).toBeTruthy();
      });
    });

    describe('ngAfterViewInit', () => {
      it('should call focus methos', () => {
        jest.advanceTimersByTime(1000);

        expect(mockFocus).toHaveBeenCalledWith([], 'col', expect.any(Object));
      });
    });
  });

  describe('supplier directive', () => {
    const mockList = [] as unknown as QueryList<ElementRef>;
    beforeEach(() => {
      spectator = createDirective(`
      <mac-manufacturer-supplier
        [readonly]="false"
        [manufacturerSupplierIdControl]="manufacturerSupplierIdControl"
        [supplierControl]="supplierControl"
        [supplierPlantControl]="supplierPlantControl"
        [supplierCountryControl]="supplierCountryControl"
        column="col"
        macMaterialDialogBasePart
      ></mac-manufacturer-supplier>
      `);
      directive = spectator.directive;

      directive['host'].dialogControlRefs = mockList;
    });

    describe('ngOnInit', () => {
      it('should initialize', () => {
        jest.advanceTimersByTime(1000);

        expect(directive).toBeTruthy();
        expect(directive['host']).toBeTruthy();
      });
    });

    describe('ngAfterViewInit', () => {
      it('should call focus methos', () => {
        jest.advanceTimersByTime(1000);

        expect(mockFocus).toHaveBeenCalledWith([], 'col', expect.any(Object));
      });
    });
  });

  describe('material standard directive', () => {
    const mockList = [] as unknown as QueryList<ElementRef>;
    beforeEach(() => {
      spectator = createDirective(`
      <mac-material-standard
        class="w-full"
        [readonly]="false"
        [materialStandardIdControl]="materialStandardIdControl"
        [standardDocumentsControl]="standardDocumentsControl"
        [materialNamesControl]="materialNamesControl"
        column="col"
        macMaterialDialogBasePart
      ></mac-material-standard>
      `);
      directive = spectator.directive;

      directive['host'].dialogControlRefs = mockList;
    });

    describe('ngOnInit', () => {
      it('should initialize', () => {
        jest.advanceTimersByTime(1000);

        expect(directive).toBeTruthy();
        expect(directive['host']).toBeTruthy();
      });
    });

    describe('ngAfterViewInit', () => {
      it('should call focus methos', () => {
        jest.advanceTimersByTime(1000);

        expect(mockFocus).toHaveBeenCalledWith([], 'col', expect.any(Object));
      });
    });
  });
});
