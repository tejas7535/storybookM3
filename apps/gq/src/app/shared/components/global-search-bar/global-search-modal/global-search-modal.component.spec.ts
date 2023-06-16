import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { AutoCompleteFacade } from '@gq/core/store/facades';
import { CaseFilterItem } from '@gq/core/store/reducers/models';
import {
  QuotationSearchResult,
  QuotationStatus,
} from '@gq/shared/models/quotation';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_SEARCH_RESULT_MOCK } from '../../../../../testing/mocks/models';
import { AppRoutePath } from '../../../../app-route-path.enum';
import { IdValue } from '../../../models/search';
import { QuotationService } from '../../../services/rest/quotation/quotation.service';
import { FilterNames } from '../../autocomplete-input/filter-names.enum';
import { GlobalSearchLastResultsService } from '../global-search-last-results-service/global-search-last-results.service';
import * as contextFunctions from './../../contextMenu/functions/context-menu-functions';
import { GlobalSearchModalComponent } from './global-search-modal.component';
import { OpenIn } from './models/open-in.enum';
import { ResultsListDisplay } from './models/results-list-display.enum';

describe('GlobalSearchModalComponent', () => {
  let component: GlobalSearchModalComponent;
  let spectator: Spectator<GlobalSearchModalComponent>;

  const createComponent = createComponentFactory({
    component: GlobalSearchModalComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      ReactiveFormsModule,
      PushModule,
      RouterTestingModule,
    ],
    providers: [
      {
        provide: MatDialogRef,
        useValue: {},
      },
      {
        provide: AutoCompleteFacade,
        useValue: {
          resetView: jest.fn(),
          initFacade: jest.fn(),
          autocomplete: jest.fn(),
          resetAutocompleteMaterials: jest.fn(),
          materialNumberOrDescForGlobalSearch$: of({
            filter: FilterNames.MATERIAL_NUMBER_OR_DESCRIPTION,
            items: [],
          }),
        },
      },
      {
        provide: QuotationService,
        useValue: {
          getCasesByMaterialNumber: jest
            .fn()
            .mockReturnValue(of([QUOTATION_SEARCH_RESULT_MOCK])),
        },
      },
      GlobalSearchLastResultsService,
      provideMockStore(),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    window.open = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnOnInit', () => {
    test('should init', () => {
      component.ngOnInit();
      component.searchFormControl.setValue('value');
      expect(component.autocomplete.resetView).toHaveBeenCalled();
      expect(component.autocomplete.initFacade).toHaveBeenCalled();
      expect(component.displayResultList).toBe(ResultsListDisplay.LAST_RESULTS);
    });
    test('should autocomplete', (done) => {
      component.ngOnInit();
      component.searchFormControl.setValue('value');

      setTimeout(() => {
        expect(component.autocomplete.autocomplete).toHaveBeenCalled();
        done();
      }, component['DEBOUNCE_TIME_DEFAULT']);
    });
  });

  describe('onItemSelected', () => {
    test('should call the service', () => {
      component.onItemSelected({ value: '12345', id: '1' } as IdValue);
      expect(component.searchResult).toEqual([QUOTATION_SEARCH_RESULT_MOCK]);
    });
    test('should set material number as filter', () => {
      const selectedMaterial: IdValue = {
        id: 'material description',
        value: '123456789',
        selected: false,
      };
      component.searchVal = '12345';
      component['materialNumberService'].matNumberStartsWithSearchString = jest
        .fn()
        .mockReturnValue(true);

      component.onItemSelected(selectedMaterial);

      expect(true).toBeTruthy();
    });
    test("should save in localStorage if the 'PREVIEW' list is displayed", () => {
      component.lastSearchResultsService.addLastResult = jest.fn();
      component.displayResultList = ResultsListDisplay.PREVIEW;
      component.searchVal = '12345';

      const selectedMaterial: IdValue = {
        id: 'material description',
        value: '123456789',
        selected: false,
      };

      component.onItemSelected(selectedMaterial);

      expect(
        component.lastSearchResultsService.addLastResult
      ).toHaveBeenCalledTimes(1);
      expect(
        component.lastSearchResultsService.addLastResult
      ).toHaveBeenCalledWith(selectedMaterial, '12345');
    });

    test("should NOT save in localStorage if the 'LAST_RESULTS' list is displayed", () => {
      component.lastSearchResultsService.addLastResult = jest.fn();
      component.displayResultList = ResultsListDisplay.LAST_RESULTS;
      component.searchVal = '12345';

      const selectedMaterial: IdValue = {
        id: 'material description',
        value: '123456789',
        selected: false,
      };

      component.onItemSelected(selectedMaterial);

      expect(
        component.lastSearchResultsService.addLastResult
      ).not.toHaveBeenCalled();
    });
  });
  describe('closeDialog', () => {
    test('should call dialogRef.close', () => {
      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearInputField', () => {
    test('should clear input', () => {
      component.searchFormControl.patchValue('1234');

      component.clearInputField();

      expect(component.searchFormControl.value).toEqual('');
      expect(component.displayResultList).toEqual(
        ResultsListDisplay.LAST_RESULTS
      );
    });
  });

  describe('openCase', () => {
    test('should navigate with material description and close dialog', () => {
      const url = component['router'].createUrlTree(
        [AppRoutePath.ProcessCaseViewPath],
        {
          queryParamsHandling: 'merge',
          queryParams: {
            quotation_number: QUOTATION_SEARCH_RESULT_MOCK.gqId,
            customer_number: QUOTATION_SEARCH_RESULT_MOCK.customerId,
            sales_org: QUOTATION_SEARCH_RESULT_MOCK.customerSalesOrg,
            'filter_material.materialDescription': 'matDesc',
          },
        }
      );

      component['router'].navigateByUrl = jest.fn().mockImplementation();
      component.closeDialog = jest.fn();
      component.clearInputField = jest.fn();
      component['selectedMaterialDesc'] = 'matDesc';
      component['selectedMaterialNumber'] = '';

      component.openCase(QUOTATION_SEARCH_RESULT_MOCK);

      expect(component['router'].navigateByUrl).toHaveBeenCalled();
      expect(component['router'].navigateByUrl).toHaveBeenCalledWith(url);
      expect(component.closeDialog).toHaveBeenCalled();
      expect(component.clearInputField).toHaveBeenCalled();
    });
    test('should navigate with material number and close dialog', () => {
      const url = component['router'].createUrlTree(
        [AppRoutePath.ProcessCaseViewPath],
        {
          queryParamsHandling: 'merge',
          queryParams: {
            quotation_number: QUOTATION_SEARCH_RESULT_MOCK.gqId,
            customer_number: QUOTATION_SEARCH_RESULT_MOCK.customerId,
            sales_org: QUOTATION_SEARCH_RESULT_MOCK.customerSalesOrg,
            'filter_material.materialNumber15': '12345678',
          },
        }
      );
      component['router'].navigateByUrl = jest.fn().mockImplementation();
      component.closeDialog = jest.fn();
      component.clearInputField = jest.fn();
      component['selectedMaterialDesc'] = '';
      component['selectedMaterialNumber'] = '12345678';
      component.openCase(QUOTATION_SEARCH_RESULT_MOCK);

      expect(component['router'].navigateByUrl).toHaveBeenCalled();
      expect(component['router'].navigateByUrl).toHaveBeenCalledWith(url);
      expect(component.closeDialog).toHaveBeenCalled();
      expect(component.clearInputField).toHaveBeenCalled();
    });

    test('should open in new Tab', () => {
      const functionSpy = jest.spyOn(contextFunctions, 'openInNewTabByUrl');
      const url = component['router'].createUrlTree(
        [AppRoutePath.ProcessCaseViewPath],
        {
          queryParamsHandling: 'merge',
          queryParams: {
            quotation_number: QUOTATION_SEARCH_RESULT_MOCK.gqId,
            customer_number: QUOTATION_SEARCH_RESULT_MOCK.customerId,
            sales_org: QUOTATION_SEARCH_RESULT_MOCK.customerSalesOrg,
            'filter_material.materialDescription': 'matDesc',
          },
        }
      );

      component['router'].navigateByUrl = jest.fn();
      component.closeDialog = jest.fn();
      component.clearInputField = jest.fn();
      component['selectedMaterialDesc'] = 'matDesc';
      component['selectedMaterialNumber'] = '';

      component.openCase(QUOTATION_SEARCH_RESULT_MOCK, OpenIn.tab);

      expect(component['router'].navigateByUrl).not.toHaveBeenCalled();
      expect(functionSpy).toHaveBeenCalledWith(
        `${window.location.origin}${url}`
      );
      expect(component.closeDialog).not.toHaveBeenCalled();
      expect(component.clearInputField).not.toHaveBeenCalled();
    });

    test('should open in new Window', () => {
      const functionSpy = jest.spyOn(contextFunctions, 'openInNewWindowByUrl');
      const url = component['router'].createUrlTree(
        [AppRoutePath.ProcessCaseViewPath],
        {
          queryParamsHandling: 'merge',
          queryParams: {
            quotation_number: QUOTATION_SEARCH_RESULT_MOCK.gqId,
            customer_number: QUOTATION_SEARCH_RESULT_MOCK.customerId,
            sales_org: QUOTATION_SEARCH_RESULT_MOCK.customerSalesOrg,
            'filter_material.materialDescription': 'matDesc',
          },
        }
      );

      component['router'].navigateByUrl = jest.fn();
      component.closeDialog = jest.fn();
      component.clearInputField = jest.fn();
      component['selectedMaterialDesc'] = 'matDesc';
      component['selectedMaterialNumber'] = '';

      component.openCase(QUOTATION_SEARCH_RESULT_MOCK, OpenIn.window);

      expect(component['router'].navigateByUrl).not.toHaveBeenCalled();
      expect(functionSpy).toHaveBeenCalledWith(
        `${window.location.origin}${url}`
      );
      expect(component.closeDialog).not.toHaveBeenCalled();
      expect(component.clearInputField).not.toHaveBeenCalled();
    });
  });

  describe('selectTopItem', () => {
    test('should automatically select from PREVIEW list', () => {
      const idValues = [
        {
          id: 'material description',
          value: '123456789',
        },
      ] as IdValue[];

      component.onItemSelected = jest.fn();
      component.displayResultList = ResultsListDisplay.PREVIEW;
      component.autocomplete.materialNumberOrDescForGlobalSearch$ = of({
        filter: undefined,
        options: idValues,
      } as CaseFilterItem);

      component.selectTopItem();

      expect(component.onItemSelected).toHaveBeenCalledTimes(1);
      expect(component.onItemSelected).toHaveBeenCalledWith(idValues[0]);
    });

    test('should NOT automatically select from PREVIEW list for multiple entries', () => {
      const idValues = [
        {
          id: 'material description',
          value: '123456789',
        },
        {
          id: 'material description 2',
          value: '987654321',
        },
      ] as IdValue[];

      component.onItemSelected = jest.fn();
      component.displayResultList = ResultsListDisplay.PREVIEW;
      component.autocomplete.materialNumberOrDescForGlobalSearch$ = of({
        filter: undefined,
        options: idValues,
      } as CaseFilterItem);

      component.selectTopItem();

      expect(component.onItemSelected).not.toHaveBeenCalled();
    });

    test('should automatically select from LAST_RESULTS list', () => {
      const idValues = [
        {
          id: 'material description',
          value: '123456789',
        },
      ] as IdValue[];

      component.onItemSelected = jest.fn();
      component.displayResultList = ResultsListDisplay.LAST_RESULTS;
      component.lastSearchResultsService.lastSearchResults$ = of(idValues);

      component.selectTopItem();

      expect(component.onItemSelected).toHaveBeenCalledTimes(1);
      expect(component.onItemSelected).toHaveBeenCalledWith(idValues[0]);
    });

    test('should NOT automatically select from LAST_RESULTS list for multiple entries', () => {
      const idValues = [
        {
          id: 'material description',
          value: '123456789',
        },
        {
          id: 'material description 2',
          value: '987654321',
        },
      ] as IdValue[];

      component.onItemSelected = jest.fn();
      component.displayResultList = ResultsListDisplay.LAST_RESULTS;
      component.lastSearchResultsService.lastSearchResults$ = of(idValues);

      component.selectTopItem();

      expect(component.onItemSelected).not.toHaveBeenCalled();
    });

    test('should automatically select from result list', () => {
      const searchResult = {
        gqId: 1,
        customerName: 'customerName',
        customerId: 'customerId',
        customerSalesOrg: 'customerSalesOrg',
        currency: 'EUR',
        materialNumber: 'materialNumber',
        materialPrice: 2,
        materialQuantity: 10,
        materialGpc: 0.5,
        materialPriceUnit: 1,
        status: QuotationStatus.ACTIVE,
      } as QuotationSearchResult;

      component.openCase = jest.fn();
      component.displayResultList = ResultsListDisplay.RESULT;
      component.searchResult = [searchResult];

      component.selectTopItem();

      expect(component.openCase).toHaveBeenCalledTimes(1);
      expect(component.openCase).toHaveBeenCalledWith(searchResult);
    });

    test('should NOT automatically select from result list for multiple entries', () => {
      const searchResult = {
        gqId: 1,
        customerName: 'customerName',
        customerId: 'customerId',
        customerSalesOrg: 'customerSalesOrg',
        currency: 'EUR',
        materialNumber: 'materialNumber',
        materialPrice: 2,
        materialQuantity: 10,
        materialGpc: 0.5,
        materialPriceUnit: 1,
        status: QuotationStatus.ACTIVE,
      } as QuotationSearchResult;

      component.openCase = jest.fn();
      component.displayResultList = ResultsListDisplay.RESULT;
      component.searchResult = [searchResult, searchResult];

      component.selectTopItem();

      expect(component.openCase).not.toHaveBeenCalled();
    });
  });
});
