import { MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import { QuotationSummaryService } from '@gq/shared/services/rest/quotation/quotation-summary/quotation-summary.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { CasesCriteriaSelection } from '../cases-result-table/cases-criteria-selection.enum';
import { MaterialsCriteriaSelection } from '../materials-result-table/material-criteria-selection.enum';
import { GlobalSearchAdvancedModalComponent } from './global-search-advanced-modal.component';

describe('GlobalSearchAdvancedModalComponent', () => {
  let component: GlobalSearchAdvancedModalComponent;
  let spectator: SpectatorService<GlobalSearchAdvancedModalComponent>;

  const createService = createServiceFactory({
    service: GlobalSearchAdvancedModalComponent,
    providers: [
      {
        provide: MatDialogRef,
        useValue: {
          close: jest.fn(),
        },
      },
      {
        provide: QuotationSummaryService,
        useValue: {
          getSearchResultsByCases: jest.fn(() => of({ results: [] })),
          getSearchResultsByMaterials: jest.fn(() => of({ results: [] })),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    component = spectator.inject(GlobalSearchAdvancedModalComponent);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    test('should subscribe to searchFormControl value changes', () => {
      const spy = jest.spyOn(
        component.searchFormControl.valueChanges,
        'subscribe'
      );

      component.ngOnInit();

      expect(spy).toHaveBeenCalled();
    });
    test('should subscribe to searchFormControl value changes and set displayError', (done) => {
      const spy = jest.spyOn(component.searchFormControl, 'setErrors');
      component.ngOnInit();
      component.searchFormControl.setValue('te');

      setTimeout(() => {
        expect(spy).toHaveBeenCalled();
        done();
      }, 2000);
    });
    test('should subscribe to searchFormControl value changes and NOT set any Errors', (done) => {
      const spy = jest.spyOn(component.searchFormControl, 'setErrors');
      component.ngOnInit();
      component.searchFormControl.setValue('test');

      setTimeout(() => {
        expect(spy).not.toHaveBeenCalled();
        done();
      }, 2000);
    });
  });
  describe('search', () => {
    test('should call determineSearch', () => {
      component['determineSearch'] = jest.fn();
      component.search();
      expect(component['determineSearch']).toHaveBeenCalled();
    });
  });
  describe('toggleOnlyUserCases', () => {
    it('should toggle onlyUserCases', () => {
      component.onlyUserCases = false;

      component.toggleOnlyUserCases();
      expect(component.onlyUserCases).toBe(true);

      component.toggleOnlyUserCases();
      expect(component.onlyUserCases).toBe(false);
    });
  });

  describe('casesCriteriaSelected', () => {
    test('should set casesSearchCriteria', () => {
      component.casesSearchCriteria = null;
      component.tabIndex = 1;
      component['updateValidators'] = jest.fn();
      component.casesCriteriaSelected(CasesCriteriaSelection.GQ_ID);
      expect(component.casesSearchCriteria).toBe(CasesCriteriaSelection.GQ_ID);
      expect(component['updateValidators']).not.toHaveBeenCalled();
    });

    test('should set casesSearchCriteria and call updateValidators', () => {
      component.casesSearchCriteria = null;
      component.tabIndex = 0;
      component['updateValidators'] = jest.fn();
      component.casesCriteriaSelected(CasesCriteriaSelection.GQ_ID);
      expect(component.casesSearchCriteria).toBe(CasesCriteriaSelection.GQ_ID);
      expect(component['updateValidators']).toHaveBeenCalled();
    });
  });

  describe('materialCriteriaSelected', () => {
    test('should set materialSearchCriteria', () => {
      component.materialSearchCriteria = null;
      component.tabIndex = 0;
      component['updateValidators'] = jest.fn();

      component.materialCriteriaSelected(
        MaterialsCriteriaSelection.MATERIAL_NUMBER
      );
      expect(component.materialSearchCriteria).toBe(
        MaterialsCriteriaSelection.MATERIAL_NUMBER
      );
      expect(component['updateValidators']).not.toHaveBeenCalled();
    });

    test('should set materialSearchCriteria and call updateValidators', () => {
      component.materialSearchCriteria = null;
      component.tabIndex = 1;
      component['updateValidators'] = jest.fn();

      component.materialCriteriaSelected(
        MaterialsCriteriaSelection.MATERIAL_NUMBER
      );
      expect(component.materialSearchCriteria).toBe(
        MaterialsCriteriaSelection.MATERIAL_NUMBER
      );
      expect(component['updateValidators']).toHaveBeenCalled();
    });
  });

  describe('tabChanged', () => {
    test('should call updateValidators with CasesCriteria', () => {
      component.tabIndex = 0;
      component.casesSearchCriteria = CasesCriteriaSelection.GQ_ID;
      component.materialSearchCriteria =
        MaterialsCriteriaSelection.MATERIAL_NUMBER;
      component['updateValidators'] = jest.fn();

      component.tabChanged();
      expect(component['updateValidators']).toHaveBeenCalledWith(
        CasesCriteriaSelection.GQ_ID
      );
    });

    test('should call updateValidators with MaterialCriteria', () => {
      component.tabIndex = 1;
      component.casesSearchCriteria = CasesCriteriaSelection.GQ_ID;
      component.materialSearchCriteria =
        MaterialsCriteriaSelection.MATERIAL_NUMBER;
      component['updateValidators'] = jest.fn();

      component.tabChanged();
      expect(component['updateValidators']).toHaveBeenCalledWith(
        MaterialsCriteriaSelection.MATERIAL_NUMBER
      );
    });
  });
  describe('closeDialog', () => {
    it('should close the dialog', () => {
      const spy = jest.spyOn(component['dialogRef'], 'close');
      component['resetSubject$$'].complete = jest.fn();
      component['searchByMaterialsSubject$$'].complete = jest.fn();
      component['searchByCasesSubject$$'].complete = jest.fn();

      component.closeDialog();

      expect(spy).toHaveBeenCalled();
      expect(component['resetSubject$$'].complete).toHaveBeenCalled();
      expect(
        component['searchByMaterialsSubject$$'].complete
      ).toHaveBeenCalled();
      expect(component['searchByCasesSubject$$'].complete).toHaveBeenCalled();
    });
  });

  describe('clearInputField', () => {
    it('should clear the input field', () => {
      component.onlyUserCases = true;
      component.searchFormControl.patchValue('test');
      component['loading$$'].next = jest.fn();
      component['resetSubject$$'].next = jest.fn();

      component.clearDialog();

      expect(component.onlyUserCases).toBe(false);
      expect(component.searchFormControl.value).toBe('');
      expect(component.casesResults).toBe(null);
      expect(component.materialResults).toBe(null);
      expect(component['loading$$'].next).toHaveBeenCalled();
      expect(component['resetSubject$$'].next).toHaveBeenCalled();
    });
  });

  describe('determineSearch', () => {
    test('should trigger search by cases when TabIndex is 0 (by Cases)', () => {
      component['searchByCasesSubject$$'].next = jest.fn();
      component.tabIndex = 0;

      component['determineSearch']();

      expect(component['searchByCasesSubject$$'].next).toHaveBeenCalled();
    });

    test('should trigger search by materials when TabIndex is 1 (by Materials)', () => {
      component['searchByMaterialsSubject$$'].next = jest.fn();
      component.tabIndex = 1;

      component['determineSearch']();

      expect(component['searchByMaterialsSubject$$'].next).toHaveBeenCalled();
    });
  });

  describe('updateValidators', () => {
    test('should call setValidators when activeMinLengthForValidation differs from minLength', () => {
      component.activeMinLengthForValidation = 3;
      component.searchFormControl.setValidators = jest.fn();

      component['updateValidators'](MaterialsCriteriaSelection.MATERIAL_NUMBER);

      expect(component.searchFormControl.setValidators).toHaveBeenCalled();
    });
    test('should NOT call setValidators when activeMinLengthForValidation equals minLength', () => {
      component.activeMinLengthForValidation = 3;
      component.searchFormControl.setValidators = jest.fn();

      component['updateValidators'](CasesCriteriaSelection.GQ_ID);

      expect(component.searchFormControl.setValidators).not.toHaveBeenCalled();
    });
  });
});
