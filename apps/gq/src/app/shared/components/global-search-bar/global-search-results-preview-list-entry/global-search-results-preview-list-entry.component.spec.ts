import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { GlobalSearchResultsPreviewListEntryComponent } from './global-search-results-preview-list-entry.component';

describe('GlobalSearchResultsPreviewListEntryComponent', () => {
  let component: GlobalSearchResultsPreviewListEntryComponent;
  let spectator: Spectator<GlobalSearchResultsPreviewListEntryComponent>;

  const createComponent = createComponentFactory({
    component: GlobalSearchResultsPreviewListEntryComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), MatIconModule],
    declarations: [GlobalSearchResultsPreviewListEntryComponent],
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
      const materialNr = '1234512345123';
      component.materialNr = materialNr;

      component.itemClicked();

      expect(component.itemSelected.emit).toHaveBeenCalledWith(materialNr);
      expect(component.itemSelected.emit).toHaveBeenCalledTimes(1);
    });
  });
});
