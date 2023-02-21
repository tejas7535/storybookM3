import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_SEARCH_RESULT_MOCK } from '../../../../../testing/mocks/models';
import { AppRoutePath } from '../../../../app-route-path.enum';
import { AutoCompleteFacade } from '../../../../core/store';
import { IdValue } from '../../../models/search';
import { QuotationService } from '../../../services/rest-services/quotation-service/quotation.service';
import { FilterNames } from '../../autocomplete-input/filter-names.enum';
import { GlobalSearchResultsPreviewListComponent } from '../global-search-results-preview-list/global-search-results-preview-list.component';
import { GlobalSearchModalComponent } from './global-search-modal.component';
describe('GlobalSearchModalComponent', () => {
  let component: GlobalSearchModalComponent;
  let spectator: Spectator<GlobalSearchModalComponent>;

  const createComponent = createComponentFactory({
    component: GlobalSearchModalComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MatIconModule,
      FormsModule,
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

      provideMockStore(),
    ],
    declarations: [
      GlobalSearchModalComponent,
      GlobalSearchResultsPreviewListComponent,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
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
      expect(component.displayResultList).toBe('preview');
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
      expect(component.displayResultList).toEqual('preview');
    });
  });

  describe('openCase', () => {
    test('should navigate with material description and close dialog', () => {
      component['router'].navigate = jest.fn().mockImplementation();
      component.closeDialog = jest.fn();
      component.clearInputField = jest.fn();
      component['selectedMaterialDesc'] = 'matDesc';
      component['selectedMaterialNumber'] = '';

      component.openCase(QUOTATION_SEARCH_RESULT_MOCK);

      expect(component['router'].navigate).toHaveBeenCalled();
      expect(component['router'].navigate).toHaveBeenCalledWith(
        [AppRoutePath.ProcessCaseViewPath],
        {
          queryParamsHandling: 'merge',
          queryParams: {
            quotation_number: QUOTATION_SEARCH_RESULT_MOCK.gqId,
            customer_number: QUOTATION_SEARCH_RESULT_MOCK.customerNumber,
            sales_org: QUOTATION_SEARCH_RESULT_MOCK.salesOrg,
            'filter_material.materialDescription': 'matDesc',
          },
        }
      );
      expect(component.closeDialog).toHaveBeenCalled();
      expect(component.clearInputField).toHaveBeenCalled();
    });
    test('should navigate with material number and close dialog', () => {
      component['router'].navigate = jest.fn().mockImplementation();
      component.closeDialog = jest.fn();
      component.clearInputField = jest.fn();
      component['selectedMaterialDesc'] = '';
      component['selectedMaterialNumber'] = '12345678';
      component.openCase(QUOTATION_SEARCH_RESULT_MOCK);

      expect(component['router'].navigate).toHaveBeenCalled();
      expect(component['router'].navigate).toHaveBeenCalledWith(
        [AppRoutePath.ProcessCaseViewPath],
        {
          queryParamsHandling: 'merge',
          queryParams: {
            quotation_number: QUOTATION_SEARCH_RESULT_MOCK.gqId,
            customer_number: QUOTATION_SEARCH_RESULT_MOCK.customerNumber,
            sales_org: QUOTATION_SEARCH_RESULT_MOCK.salesOrg,
            'filter_material.materialNumber15': '12345678',
          },
        }
      );
      expect(component.closeDialog).toHaveBeenCalled();
      expect(component.clearInputField).toHaveBeenCalled();
    });
  });
});
