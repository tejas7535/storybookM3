import { MatCheckboxModule } from '@angular/material/checkbox';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { MaterialSelectionComponent } from './material-selection.component';

describe('MaterialSelectionComponent', () => {
  let component: MaterialSelectionComponent;
  let spectator: Spectator<MaterialSelectionComponent>;

  const createComponent = createComponentFactory({
    component: MaterialSelectionComponent,
    imports: [MatCheckboxModule, provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('createCopy', () => {
    test('should create copy', () => {
      const result = component.createDefaultSelectionCopy();
      expect(result).toEqual(component.defaultSelection);
    });
  });
  describe('updateSelection', () => {
    test('should update selection', () => {
      component.selectionItems = [
        { id: 1, checked: false },
        { id: 2, checked: false },
      ] as any;

      component.updateSelection({ checked: true } as any, 1);

      expect(component.allComplete).toBeFalsy();
      expect(component.someComplete).toBeTruthy();
    });
  });

  describe('selectAll', () => {
    test('should select all', () => {
      component.selectionItems = [
        { id: 1, checked: false },
        { id: 2, checked: false },
      ] as any;

      component.selectAll({ checked: true } as any);

      expect(
        component.selectionItems.every((item) => item.checked)
      ).toBeTruthy();
    });
  });

  describe('resetAll', () => {
    test('should resetAll', () => {
      component.resetAll();

      expect(component.allComplete).toBeFalsy();
      expect(component.someComplete).toBeTruthy();
      expect(component.selectionItems).toEqual(component.defaultSelection);
    });
  });
});
