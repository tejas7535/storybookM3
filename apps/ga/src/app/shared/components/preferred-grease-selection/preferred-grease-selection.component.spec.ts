import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationParametersFacade } from '@ga/core/store';
import { PREFERRED_GREASE_OPTION_MOCK } from '@ga/testing/mocks';

import { PreferredGreaseSelectionComponent } from './preferred-grease-selection.component';

describe('PreferredGreaseSelectionComponent', () => {
  let component: PreferredGreaseSelectionComponent;
  let spectator: Spectator<PreferredGreaseSelectionComponent>;
  let parametersFacade: CalculationParametersFacade;

  const mockGreaseCategories = [
    {
      name: 'Category 1',
      entries: [
        { id: 'grease1', text: 'Super grease 1' },
        { id: 'grease2', text: 'Grease 2' },
      ],
    },
    {
      name: 'Category 2',
      entries: [
        { id: 'grease3', text: 'Super grease 3' },
        { id: 'grease4', text: 'Grease 4' },
      ],
    },
  ];

  const createComponent = createComponentFactory({
    component: PreferredGreaseSelectionComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      {
        provide: CalculationParametersFacade,
        useValue: {
          setSelectedGrease: jest.fn(),
          preferredGrease: () => ({ selectedGrease: undefined as any }),
          allGreases: () => mockGreaseCategories,
          preselectionDisabledHint: (): string | undefined => undefined,
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    parametersFacade = spectator.inject(CalculationParametersFacade);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('onPreferredGreaseSelectionChange', () => {
    it('should call setSelectedGrease on the facade', () => {
      component.onPreferredGreaseSelectionChange(PREFERRED_GREASE_OPTION_MOCK);

      expect(parametersFacade.setSelectedGrease).toHaveBeenCalledWith(
        PREFERRED_GREASE_OPTION_MOCK
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

  describe('filteredGreases', () => {
    it('should return all greases when searchTerm is empty', () => {
      component.searchTerm.set('');

      const result = component.filteredGreases();

      expect(result).toEqual(mockGreaseCategories);
    });

    it('should filter greases by search term', () => {
      component.searchTerm.set('grease 2');

      const result = component.filteredGreases();

      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Category 1');
      expect(result[0].entries.length).toBe(1);
      expect(result[0].entries[0].text).toBe('Grease 2');
    });

    it('should include preferred grease in results if it matches when selected', () => {
      const mockPreferredGrease = { id: 'grease1', text: 'Grease 1' };
      jest.spyOn(parametersFacade, 'preferredGrease').mockReturnValue({
        loading: false,
        greaseOptions: [],
        selectedGrease: mockPreferredGrease,
      });

      component.searchTerm.set('super');

      const result = component.filteredGreases();

      const foundGrease1 = result.some((category) =>
        category.entries.some((entry) => entry.id === 'grease1')
      );
      const foundGrease3 = result.some((category) =>
        category.entries.some((entry) => entry.id === 'grease3')
      );

      expect(foundGrease1).toBe(true);
      expect(foundGrease3).toBe(true);
    });
  });

  describe('onKey', () => {
    it('should prevent default action for Enter key', () => {
      const event = {
        key: 'Enter',
        preventDefault: jest.fn(),
      };

      component.onKey(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should not prevent default for other keys', () => {
      const event = {
        key: 'A',
        preventDefault: jest.fn(),
      };

      component.onKey(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('onSelectOpenedChange', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should focus search input when select is opened', () => {
      const mockElement = { focus: jest.fn() };
      component.searchInput = { nativeElement: mockElement } as any;

      component.onSelectOpened();
      jest.runAllTimers();

      expect(mockElement.focus).toHaveBeenCalled();
    });

    it('should reset search term when select is closed', () => {
      component.searchTerm.set('test');

      component.onSelectClosed();

      expect(component.searchTerm()).toBe('');
    });
  });

  describe('onSearchInput', () => {
    it('should update searchTerm with input value', () => {
      const event = { target: { value: 'search text' } } as unknown as Event;

      component.onSearchInput(event);

      expect(component.searchTerm()).toBe('search text');
    });
  });
});
