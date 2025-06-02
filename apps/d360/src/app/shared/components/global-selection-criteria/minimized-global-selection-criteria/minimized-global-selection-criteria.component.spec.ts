import { FormGroup } from '@angular/forms';

import { Stub } from '../../../test/stub.class';
import {
  GlobalSelectionFilters,
  GlobalSelectionState,
} from '../global-selection-state.service';
import { MinimizedGlobalSelectionCriteriaComponent } from '../minimized-global-selection-criteria/minimized-global-selection-criteria.component';

describe('MinimizedGlobalSelectionCriteriaComponent', () => {
  let component: MinimizedGlobalSelectionCriteriaComponent;

  beforeEach(() => {
    component = Stub.getForEffect<MinimizedGlobalSelectionCriteriaComponent>({
      component: MinimizedGlobalSelectionCriteriaComponent,
    });

    Stub.setInputs([
      { property: 'filters', value: {} as GlobalSelectionState },
      {
        property: 'form',
        value: new FormGroup<GlobalSelectionFilters>(
          {} as GlobalSelectionFilters
        ),
      },
    ]);

    Stub.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('values', () => {
    it('should transform single string values correctly', () => {
      const mockFilters = {
        region: 'Europe',
        year: '2023',
      };

      Stub.setInputs([{ property: 'filters', value: mockFilters }]);
      Stub.detectChanges();

      const result = component.values();
      expect(result.length).toBe(2);
      expect(result).toContainEqual({
        id: 'region',
        text: 'Europe',
        field: 'region',
      });
      expect(result).toContainEqual({
        id: 'year',
        text: '2023',
        field: 'year',
      });
    });

    it('should transform array values correctly', () => {
      const mockFilters = {
        countries: [
          { id: '1', text: 'Germany' },
          { id: '2', text: 'France' },
        ],
      };

      Stub.setInputs([{ property: 'filters', value: mockFilters }]);
      Stub.detectChanges();

      const result = component.values();
      expect(result.length).toBe(2);
      expect(result).toContainEqual({
        id: '1',
        text: 'Germany',
        field: 'countries',
      });
      expect(result).toContainEqual({
        id: '2',
        text: 'France',
        field: 'countries',
      });
    });

    it('should ignore empty string values', () => {
      const mockFilters = {
        region: '',
        countries: [{ id: '1', text: 'Germany' }],
      };

      Stub.setInputs([{ property: 'filters', value: mockFilters }]);
      Stub.detectChanges();

      const result = component.values();
      expect(result.length).toBe(1);
      expect(result).toContainEqual({
        id: '1',
        text: 'Germany',
        field: 'countries',
      });
    });
  });

  describe('remove', () => {
    it('should remove an item from an array control', () => {
      const formControl = {
        setValue: jest.fn(),
        value: [
          { id: '1', text: 'Germany' },
          { id: '2', text: 'France' },
        ],
      };
      const formGroup = {
        get: jest.fn().mockReturnValue(formControl),
      };

      Stub.setInputs([{ property: 'form', value: formGroup }]);

      const filterToRemove = { id: '1', text: 'Germany', field: 'countries' };
      const expectedResult = [{ id: '2', text: 'France' }];

      jest.spyOn(component.selectionChanged, 'emit');

      component.remove(filterToRemove);

      expect(formGroup.get).toHaveBeenCalledWith('countries');
      expect(formControl.setValue).toHaveBeenCalledWith(expectedResult);
      expect(component.selectionChanged.emit).toHaveBeenCalled();
    });

    it('should clear a string control', () => {
      const formControl = {
        setValue: jest.fn(),
        value: 'Europe',
      };
      const formGroup = {
        get: jest.fn().mockReturnValue(formControl),
      };

      Stub.setInputs([{ property: 'form', value: formGroup }]);

      const filterToRemove = { id: 'region', text: 'Europe', field: 'region' };

      jest.spyOn(component.selectionChanged, 'emit');

      component.remove(filterToRemove);

      expect(formGroup.get).toHaveBeenCalledWith('region');
      expect(formControl.setValue).toHaveBeenCalledWith(null);
      expect(component.selectionChanged.emit).toHaveBeenCalled();
    });
  });
});
