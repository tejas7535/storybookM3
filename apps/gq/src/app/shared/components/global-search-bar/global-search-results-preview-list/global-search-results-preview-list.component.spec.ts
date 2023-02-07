import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

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
      const materialNr = '1234512345123';

      component.onItemSelected(materialNr);

      expect(component.itemSelected.emit).toHaveBeenCalledWith(materialNr);
      expect(component.itemSelected.emit).toHaveBeenCalledTimes(1);
    });
  });
});
