import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { IdValue } from '../../../models/search';
import { GlobalSearchResultsPreviewListEntryComponent } from './global-search-results-preview-list-entry.component';

describe('GlobalSearchResultsPreviewListEntryComponent', () => {
  let component: GlobalSearchResultsPreviewListEntryComponent;
  let spectator: Spectator<GlobalSearchResultsPreviewListEntryComponent>;

  const createComponent = createComponentFactory({
    component: GlobalSearchResultsPreviewListEntryComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), MatIconModule],
    declarations: [GlobalSearchResultsPreviewListEntryComponent],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('itemClicked', () => {
    test('should emit materialNr', () => {
      component.itemSelected.emit = jest.fn();
      const idValue = { id: '12345678', value: '12345678' } as IdValue;
      component.searchVal = '1234';
      component.idValue = idValue;

      spectator.detectChanges();

      component.itemClicked();

      expect(component.itemSelected.emit).toHaveBeenCalledWith(idValue);
      expect(component.itemSelected.emit).toHaveBeenCalledTimes(1);
    });
  });
});
