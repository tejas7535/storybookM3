import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MaterialsResultTableComponent } from './materials-result-table.component';

describe('CasesResultTableComponent', () => {
  let component: MaterialsResultTableComponent;
  let spectator: Spectator<MaterialsResultTableComponent>;

  const createComponent = createComponentFactory({
    component: MaterialsResultTableComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should emit criteriaSelectedValue', () => {
      component.criteriaSelectedValue = 'matNumber';
      const emitSpy = jest.spyOn(component.criteriaSelected, 'emit');
      component.ngOnInit();
      expect(emitSpy).toHaveBeenCalledWith(component.criteriaSelectedValue);
    });
  });

  describe('radioButtonChanged', () => {
    it('should emit criteriaSelectedValue', () => {
      component.criteriaSelectedValue = 'matNumber';
      const emitSpy = jest.spyOn(component.criteriaSelected, 'emit');
      component.radioButtonChanged();
      expect(emitSpy).toHaveBeenCalledWith(component.criteriaSelectedValue);
    });
  });
});
