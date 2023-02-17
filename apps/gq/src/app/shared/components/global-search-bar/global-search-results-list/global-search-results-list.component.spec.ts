import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { QuotationSearchResult } from '../../../models/quotation';
import { GlobalSearchResultsListComponent } from './global-search-results-list.component';

describe('GlobalSearchResultsListComponent', () => {
  let component: GlobalSearchResultsListComponent;
  let spectator: Spectator<GlobalSearchResultsListComponent>;

  const createComponent = createComponentFactory({
    component: GlobalSearchResultsListComponent,
    imports: [],
    declarations: [],
    detectChanges: true,
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('increaseCount', () => {
    beforeEach(() => {
      component.count = 3;
    });
    test('should increase the count and add 5', () => {
      component.count = 3;
      component.gqCases = {
        length: 12,
      } as unknown as QuotationSearchResult[];
      component.increaseCount();
      expect(component.count).toBe(8);
    });
    test('should increase the count with maximum length of array', () => {
      component.gqCases = {
        length: 6,
      } as unknown as QuotationSearchResult[];
      component.increaseCount();
      expect(component.count).toBe(6);
    });
    test('should not increase count when array is length 2', () => {
      component.gqCases = {
        length: 2,
      } as unknown as QuotationSearchResult[];
      component.increaseCount();
      expect(component.count).toBe(2);
    });
    test('should not increase count when array is length 2 , try increase twice', () => {
      component.gqCases = {
        length: 2,
      } as unknown as QuotationSearchResult[];
      component.increaseCount();
      component.increaseCount();
      expect(component.count).toBe(2);
    });
    test('should calculate count, set 0 when array is not set', () => {
      component.gqCases = undefined;
      component.increaseCount();
      expect(component.count).toBe(0);
    });
  });
});
