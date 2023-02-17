import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

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

  describe('onItemSelected', () => {
    test(
      'should call the service',
      marbles((m) => {
        component.onItemSelected({ value: '12345', id: '1' } as IdValue);
        const expected = m.cold('(a|)', { a: [QUOTATION_SEARCH_RESULT_MOCK] });

        m.expect(component.searchResult$).toBeObservable(expected);
      })
    );
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
    test('should navigate and close dialog', () => {
      component['router'].navigate = jest.fn().mockImplementation();
      component.closeDialog = jest.fn();
      component.clearInputField = jest.fn();

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
          },
        }
      );
      expect(component.closeDialog).toHaveBeenCalled();
      expect(component.clearInputField).toHaveBeenCalled();
    });
  });
});
