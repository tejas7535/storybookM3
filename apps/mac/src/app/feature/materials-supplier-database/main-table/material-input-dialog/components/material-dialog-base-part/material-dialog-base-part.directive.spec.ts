import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  QueryList,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { of } from 'rxjs';

import {
  createDirectiveFactory,
  SpectatorDirective,
} from '@ngneat/spectator/jest';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { StringOption } from '@schaeffler/inputs';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';
import { initialState as initialDialogState } from '@mac/msd/store/reducers/dialog/dialog.reducer';
import {
  mockMaterialStandards,
  mockSuppliers,
} from '@mac/testing/mocks/msd/input-dialog.mock';

import * as en from '../../../../../../../assets/i18n/en.json';
import { MaterialInputDialogModule } from '../../material-input-dialog.module';
import * as utils from '../../util';
import { MaterialDialogBasePartDirective } from './material-dialog-base-part.directive';

@Component({
  selector: 'mac-host-component',
  template: '',
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

  const initialState = {
    msd: {
      data: {
        ...initialDataState,
      },
      dialog: {
        ...initialDialogState,
        dialogOptions: {
          ...initialDialogState.dialogOptions,
          materialStandards: mockMaterialStandards,
          materialStandardsLoading: true,
          manufacturerSuppliers: mockSuppliers,
          manufacturerSuppliersLoading: true,
          ratings: ['1'],
          ratingsLoading: true,
          steelMakingProcesses: ['1'],
          steelMakingProcessesLoading: true,
          co2Classifications: ['1'],
          co2ClassificationsLoading: true,
          castingModes: ['1'],
          castingModesLoading: true,
          loading: true,
        },
        createMaterial: {
          ...initialDialogState.createMaterial,
          createMaterialLoading: true,
          createMaterialSuccess: true,
        },
      },
    },
  };

  let mockFocus: any;

  const mockCdRef = {} as unknown as ChangeDetectorRef;

  const createDirective = createDirectiveFactory({
    directive: MaterialDialogBasePartDirective,
    imports: [MaterialInputDialogModule],
    providers: [
      {
        provide: ChangeDetectorRef,
        useValue: mockCdRef,
      },
    ],
    template: `<div macMaterialDialogBasePart></div>
        `,
  });
  const createCo2Directive = createDirectiveFactory({
    directive: MaterialDialogBasePartDirective,
    imports: [MaterialInputDialogModule, provideTranslocoTestingModule({ en })],
    providers: [
      {
        provide: ChangeDetectorRef,
        useValue: mockCdRef,
      },
      provideMockStore({ initialState }),
      provideMockActions(() => of()),
    ],
    template: `
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
        `,
    host: HostComponent,
  });

  const createSupplierDirective = createDirectiveFactory({
    directive: MaterialDialogBasePartDirective,
    imports: [MaterialInputDialogModule],
    providers: [
      {
        provide: ChangeDetectorRef,
        useValue: mockCdRef,
      },
    ],
    template: `
            <mac-manufacturer-supplier
              [readonly]="false"
              [manufacturerSupplierIdControl]="manufacturerSupplierIdControl"
              [supplierControl]="supplierControl"
              [supplierPlantControl]="supplierPlantControl"
              [supplierCountryControl]="supplierCountryControl"
              column="col"
              macMaterialDialogBasePart
            ></mac-manufacturer-supplier>
            `,
    host: HostComponent,
  });

  const createMaterialStandardDirective = createDirectiveFactory({
    directive: MaterialDialogBasePartDirective,
    imports: [MaterialInputDialogModule],
    providers: [
      {
        provide: ChangeDetectorRef,
        useValue: mockCdRef,
      },
    ],
    template: `
          <mac-material-standard
            class="w-full"
            [readonly]="false"
            [materialStandardIdControl]="materialStandardIdControl"
            [standardDocumentsControl]="standardDocumentsControl"
            [materialNamesControl]="materialNamesControl"
            column="col"
            macMaterialDialogBasePart
          ></mac-material-standard>
          `,
    host: HostComponent,
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
      spectator = createCo2Directive();
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
      spectator = createSupplierDirective();
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
      spectator = createMaterialStandardDirective();
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
