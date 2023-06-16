import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatLegacySelectChange as MatSelectChange,
  MatLegacySelectModule as MatSelectModule,
} from '@angular/material/legacy-select';

import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FilterSelectionComponent } from './filter-selection.component';

describe('FilterSelectionComponent', () => {
  let component: FilterSelectionComponent;
  let spectator: Spectator<FilterSelectionComponent>;

  const createComponent = createComponentFactory({
    component: FilterSelectionComponent,
    imports: [
      MatSelectModule,
      MatFormFieldModule,
      ReactiveFormsModule,
      SharedPipesModule,
      provideTranslocoTestingModule({}),
    ],
    providers: [
      FormBuilder,
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.setInput('items', []);
    component = spectator.debugElement.componentInstance;
    spectator.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    test('should trigger list selection', () => {
      component.form = { controls: { items: { disable: jest.fn() } } } as any;
      component.selectList = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges();

      expect(component.selectList).toHaveBeenCalledTimes(1);
      expect(component.form.controls.items.disable).toHaveBeenCalledTimes(1);
    });
  });

  describe('selectionChange', () => {
    test('should emitSelection', () => {
      component.emitSelection = jest.fn();

      component.selectionChange({ value: [0, '1'] } as MatSelectChange);

      expect(component.emitSelection).toHaveBeenCalledTimes(1);
      expect(component.emitSelection).toHaveBeenCalledWith(['1']);
    });
  });

  describe('emitSelection', () => {
    test('should emit output', () => {
      component.selection.emit = jest.fn();

      component.emitSelection(['1']);

      expect(component.selection.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('toggleAllSelection', () => {
    test('should toggle all selection', () => {
      component.emitSelection = jest.fn();
      component.items = [{ value: 1 }] as any;
      component['allSelected'] = { selected: true } as any;
      component.toggleAllSelection();

      expect(component.emitSelection).toHaveBeenCalledTimes(1);
      expect(component.emitSelection).toHaveBeenCalledWith([1]);
    });
    test('should toggle all selection with empty array', () => {
      component.emitSelection = jest.fn();
      component.items = [{ value: 1 }] as any;
      component['allSelected'] = { selected: false } as any;
      component.toggleAllSelection();

      expect(component.emitSelection).toHaveBeenCalledTimes(1);
      expect(component.emitSelection).toHaveBeenCalledWith([]);
    });
  });

  describe('selectList', () => {
    test('should patchValue', () => {
      component.items = [
        { value: '10', selected: true },
        { value: '11', selected: false },
      ];
      component.form = {
        controls: {
          items: {
            patchValue: jest.fn(),
          },
        },
      } as any;
      component.selectList();

      expect(component).toBeTruthy();

      expect(component.form.controls.items.patchValue).toHaveBeenCalledWith([
        component.items[0].value,
      ]);
    });
    test('should patchValue with allSelected', () => {
      component.items = [{ value: '10', selected: true }];
      component.form = {
        controls: {
          items: {
            patchValue: jest.fn(),
          },
        },
      } as any;
      component.selectList();

      expect(component).toBeTruthy();

      expect(component.form.controls.items.patchValue).toHaveBeenCalledWith([
        component.items[0].value,
        0,
      ]);
    });
  });
});
