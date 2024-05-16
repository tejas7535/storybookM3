import { MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import { QuotationSummaryService } from '@gq/shared/services/rest/quotation/quotation-summary/quotation-summary.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { CasesCriteriaSelection } from '../cases-result-table/cases-criteria-selection.enum';
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

  describe('search', () => {
    it('should call determineSearch', () => {
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
    it('should set casesSearchCriteria', () => {
      component.casesSearchCriteria = null;

      component.casesCriteriaSelected(CasesCriteriaSelection.GQ_ID);
      expect(component.casesSearchCriteria).toBe(CasesCriteriaSelection.GQ_ID);
    });
  });

  describe('materialCriteriaSelected', () => {
    it('should set materialSearchCriteria', () => {
      component.materialSearchCriteria = null;

      component.materialCriteriaSelected('test');
      expect(component.materialSearchCriteria).toBe('test');
    });
  });
  describe('closeDialog', () => {
    it('should close the dialog', () => {
      const spy = jest.spyOn(component['dialogRef'], 'close');

      component.closeDialog();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('clearInputField', () => {
    it('should clear the input field', () => {
      component.onlyUserCases = true;
      component.searchFormControl.patchValue('test');

      component.clearInputField();
      expect(component.onlyUserCases).toBe(false);
      expect(component.searchFormControl.value).toBe('');
    });
  });

  describe('determineSearch', () => {
    test('should call getSearchResultsByCases when TabIndex is 0 (by Cases)', () => {
      component.casesResults = null;
      component.tabIndex = 0;

      component['determineSearch']();

      expect(component.casesResults).toEqual({ results: [] });
    });
  });
});
