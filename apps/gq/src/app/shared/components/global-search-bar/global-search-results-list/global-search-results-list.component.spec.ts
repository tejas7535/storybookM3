import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';

// eslint-disable-next-line no-restricted-imports
import { createMouseEvent } from '@ngneat/spectator';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { QuotationSearchResult } from '../../../models/quotation';
import { GlobalSearchResultsListComponent } from './global-search-results-list.component';

describe('GlobalSearchResultsListComponent', () => {
  let component: GlobalSearchResultsListComponent;
  let spectator: Spectator<GlobalSearchResultsListComponent>;

  const createComponent = createComponentFactory({
    component: GlobalSearchResultsListComponent,
    imports: [MatMenuModule],
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

  describe('showContextMenu', () => {
    test('should call contextMenu', () => {
      const mouseEvent: MouseEvent = createMouseEvent('click', 100, 200);
      const mouseSpy = jest.spyOn(mouseEvent, 'preventDefault');

      component.contextMenu = {
        openMenu: jest.fn(),
      } as unknown as MatMenuTrigger;

      component.showContextMenu(mouseEvent, {} as QuotationSearchResult);

      expect(component.contextMenu.openMenu).toHaveBeenCalled();
      expect(mouseSpy).toHaveBeenCalled();
    });
  });
});
