import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { IdValue } from '../../../models/search';
import { GlobalSearchResultsPreviewListEntryComponent } from '../global-search-results-preview-list-entry/global-search-results-preview-list-entry.component';
import { GlobalSearchResultsPreviewListComponent } from './global-search-results-preview-list.component';

describe('GlobalSearchResultsPreviewListComponent', () => {
  let component: GlobalSearchResultsPreviewListComponent;
  let spectator: Spectator<GlobalSearchResultsPreviewListComponent>;

  const createComponent = createComponentFactory({
    component: GlobalSearchResultsPreviewListComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    declarations: [
      GlobalSearchResultsPreviewListComponent,
      GlobalSearchResultsPreviewListEntryComponent,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onItemSelected', () => {
    test('should emit itemSelected', () => {
      component.itemSelected.emit = jest.fn();
      const idValue = { id: '12345678', value: '12345678' } as IdValue;

      component.onItemSelected(idValue);

      expect(component.itemSelected.emit).toHaveBeenCalledWith(idValue);
      expect(component.itemSelected.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSearchVal', () => {
    test('should return the array element if searchVal is an array', () => {
      component.searchVal = ['123', '456', '789'];

      expect(component.getSearchVal(0)).toBe('123');
      expect(component.getSearchVal(1)).toBe('456');
      expect(component.getSearchVal(2)).toBe('789');
      expect(component.getSearchVal(3)).toBe('');
    });

    test('should return the searchVal if searchVal is NOT an array', () => {
      component.searchVal = '123';

      expect(component.getSearchVal(0)).toBe('123');
      expect(component.getSearchVal(1)).toBe('123');
    });
  });
});
