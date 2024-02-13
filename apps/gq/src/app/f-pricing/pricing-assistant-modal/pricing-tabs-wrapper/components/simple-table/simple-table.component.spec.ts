import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SimpleTableComponent } from './simple-table.component';

describe('SimpleTableComponent', () => {
  let component: SimpleTableComponent;
  let spectator: Spectator<SimpleTableComponent>;

  const createComponent = createComponentFactory({
    component: SimpleTableComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should set the columnWidth', () => {
    component.columnsToDisplay = [
      'description',
      'selectedValue',
      'value',
      'additionalDescription',
    ];
    component.ngOnInit();
    expect(component.columnWidth).toEqual('!w-1/5');
  });
  test('should set the columnWidth by 2 columns', () => {
    component.columnsToDisplay = ['description', 'selectedValue'];
    component.ngOnInit();
    expect(component.columnWidth).toEqual('!w-1/2');
  });
  test('should set the columnWidth by 3 columns', () => {
    component.columnsToDisplay = ['description', 'selectedValue', 'value'];
    component.ngOnInit();
    expect(component.columnWidth).toEqual('!w-1/4');
  });
});
