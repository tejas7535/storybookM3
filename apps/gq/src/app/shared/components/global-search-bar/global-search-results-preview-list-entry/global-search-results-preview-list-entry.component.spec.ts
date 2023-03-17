import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { IdValue } from '../../../models/search';
import { GlobalSearchLastResultsService } from '../global-search-last-results-service/global-search-last-results.service';
import { GlobalSearchResultsPreviewFormatterPipe } from '../global-search-results-preview-formatter/global-search-results-preview-formatter.pipe';
import { GlobalSearchResultsPreviewListEntryComponent } from './global-search-results-preview-list-entry.component';

describe('GlobalSearchResultsPreviewListEntryComponent', () => {
  let component: GlobalSearchResultsPreviewListEntryComponent;
  let spectator: Spectator<GlobalSearchResultsPreviewListEntryComponent>;

  const createComponent = createComponentFactory({
    component: GlobalSearchResultsPreviewListEntryComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), MatIconModule],
    providers: [GlobalSearchLastResultsService],
    declarations: [
      GlobalSearchResultsPreviewListEntryComponent,
      GlobalSearchResultsPreviewFormatterPipe,
    ],
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

  describe('removeFromLocalStorage', () => {
    test('should call lastResultsService.removeResult', () => {
      const idValue = { id: '12345678', value: '12345678' } as IdValue;
      component.searchVal = '1234';
      component.idValue = idValue;
      component['lastResultsService'].removeResult = jest.fn();

      component.removeFromLocalStorage({
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      } as any);

      expect(component['lastResultsService'].removeResult).toHaveBeenCalledWith(
        idValue
      );
      expect(
        component['lastResultsService'].removeResult
      ).toHaveBeenCalledTimes(1);
    });
  });
});
