import { CommonModule } from '@angular/common';
import { discardPeriodicTasks, fakeAsync } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { CalculationResultPreviewItem } from '@ea/core/store/models';
import { EXPECTED_RESULT } from '@ea/testing/mocks/catalog-helper-mocks';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { OverrollingFrequenciesPreviewItemComponent } from './overrolling-frequencies-preview-item.component';

describe('OverrollingFrequenciesPreviewItemComponent', () => {
  let component: OverrollingFrequenciesPreviewItemComponent;
  let spectator: Spectator<OverrollingFrequenciesPreviewItemComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: OverrollingFrequenciesPreviewItemComponent,
    imports: [
      CommonModule,
      provideTranslocoTestingModule({ en: {} }),
      MatIconTestingModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          catalogCalculationResult: {
            result: EXPECTED_RESULT,
          },
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Pagination clicks', () => {
    beforeEach(() => {
      component.currentIndex$$.next = jest.fn();
    });

    it('should be ignored when clickable is set to false', async () => {
      await component.selectIndex(1);
      expect(component.currentIndex$$.next).not.toHaveBeenCalled();
    });

    it('should set the index when clickable is set to true', async () => {
      spectator.setInput('clickablePaging', true);

      await component.selectIndex(1);
      expect(component.currentIndex$$.next).toHaveBeenCalledWith(1);
    });
  });

  describe('Update inputs', () => {
    it('should update the subjects accordingly', async () => {
      const previewItems = {
        title: 'Title',
        svgIcon: 'airwaves',
        values: [{ title: 'value1', unit: '1/2', value: 'value1' }],
      } as CalculationResultPreviewItem;

      component.dataFields$$.next = jest.fn();

      spectator.setInput('item', previewItems);
      spectator.detectChanges();

      expect(component.dataFields$$.next).toHaveBeenCalledWith(
        previewItems.values
      );
    });

    it('should call the nextPage after 2s', fakeAsync(() => {
      component.nextPage = jest.fn();

      spectator.detectChanges();
      component.ngOnInit();
      spectator.tick(2500);

      discardPeriodicTasks();

      expect(component.nextPage).toHaveBeenCalledTimes(1);
    }));
  });
});
