import { Component } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Stub } from '../../../test/stub.class';
import { AbstractGeneralTableComponent } from './abstract-general-table.component';

@Component({
  selector: 'd360-test-general-table',
  template: '',
})
class TestGeneralTableComponent extends AbstractGeneralTableComponent {
  protected setConfig(): void {
    // Mock implementation
  }

  protected setColumnDefinitions(): void {
    // Mock implementation
  }
}

describe('AbstractGeneralTableComponent', () => {
  let component: TestGeneralTableComponent;

  beforeEach(() => {
    component = Stub.get<TestGeneralTableComponent>({
      component: TestGeneralTableComponent,
    });
  });

  describe('BehaviorSubject initialization', () => {
    it('should initialize fetchErrorEvent$ with null', () => {
      expect(component['fetchErrorEvent$']).toBeInstanceOf(BehaviorSubject);
      expect(component['fetchErrorEvent$'].getValue()).toBeNull();
    });

    it('should initialize dataFetchedEvent$ with default rowCount of 0', () => {
      expect(component['dataFetchedEvent$']).toBeInstanceOf(BehaviorSubject);
      expect(component['dataFetchedEvent$'].getValue()).toEqual({
        rowCount: 0,
      });
    });
  });

  describe('ngOnInit', () => {
    it('should call setColumnDefinitions', () => {
      const setColumnDefinitionsSpy = jest.spyOn<any, any>(
        component,
        'setColumnDefinitions'
      );

      component.ngOnInit();

      expect(setColumnDefinitionsSpy).toHaveBeenCalled();
    });
  });

  describe('setGridApi', () => {
    it('should set the gridApi and emit it to the parent component', () => {
      const mockGridApi = Stub.getGridApi();
      const emitSpy = jest.spyOn(component.getApi, 'emit');

      component['setGridApi'](mockGridApi);

      expect(component['gridApi']).toBe(mockGridApi);
      expect(emitSpy).toHaveBeenCalledWith(mockGridApi);
    });
  });
});
