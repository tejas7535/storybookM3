import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockDirective } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { setPreferredGreaseSelection } from '@ga/core/store/actions';
import { PREFERRED_GREASE_OPTION_MOCK } from '@ga/testing/mocks';

import { PreferredGreaseSelectionComponent } from './preferred-grease-selection.component';

describe('PreferredGreaseSelectionComponent', () => {
  let component: PreferredGreaseSelectionComponent;
  let spectator: Spectator<PreferredGreaseSelectionComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: PreferredGreaseSelectionComponent,
    imports: [
      MockDirective(LetDirective),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [provideMockStore()],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('onPreferredGreaseSelectionChange', () => {
    it('should dispatch select bearing and navigate to parameters', () => {
      component.onPreferredGreaseSelectionChange(PREFERRED_GREASE_OPTION_MOCK);

      expect(store.dispatch).toHaveBeenCalledWith(
        setPreferredGreaseSelection({
          selectedGrease: PREFERRED_GREASE_OPTION_MOCK,
        })
      );
    });
  });

  describe('compareOptions', () => {
    it('should return true', () => {
      const result = component.compareOptions(
        PREFERRED_GREASE_OPTION_MOCK,
        PREFERRED_GREASE_OPTION_MOCK
      );

      expect(result).toBe(true);
    });

    it('should return false', () => {
      const result = component.compareOptions(
        undefined,
        PREFERRED_GREASE_OPTION_MOCK
      );

      expect(result).toBe(false);
    });
  });

  describe('removeEmptyOptions', () => {
    it('should return an array of 2', () => {
      const expectedArray = [
        PREFERRED_GREASE_OPTION_MOCK,
        PREFERRED_GREASE_OPTION_MOCK,
      ];

      const resultArray = component.removeEmptyOptions([
        PREFERRED_GREASE_OPTION_MOCK,
        PREFERRED_GREASE_OPTION_MOCK,
      ]);

      expect(resultArray).toEqual(expectedArray);
    });

    it('should return an array of 1', () => {
      const expectedArray = [PREFERRED_GREASE_OPTION_MOCK];

      const resultArrayItemUndefined = component.removeEmptyOptions([
        undefined,
        PREFERRED_GREASE_OPTION_MOCK,
      ]);

      const resultArrayItemEmptyOption = component.removeEmptyOptions([
        { ...PREFERRED_GREASE_OPTION_MOCK, id: 'MOCK_PLEASE_SELECT' },
        PREFERRED_GREASE_OPTION_MOCK,
      ]);

      expect(resultArrayItemUndefined).toEqual(expectedArray);
      expect(resultArrayItemEmptyOption).toEqual(expectedArray);
    });
  });
});
