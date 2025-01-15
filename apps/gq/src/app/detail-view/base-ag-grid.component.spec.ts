import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { AG_GRID_LOCALE_DE } from '@gq/shared/ag-grid/constants/locale-de';
import { LocalizationService } from '@gq/shared/ag-grid/services';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import { marbles } from 'rxjs-marbles';

import { BaseAgGridComponent } from './base-ag-grid.component'; // Adjust the path

@Component({ template: '' })
class TestAgGridComponent extends BaseAgGridComponent {
  protected TABLE_KEY = 'TestTableKey';
}

const mockAgGridStateService = {
  init: jest.fn(),
  setActiveView: jest.fn(),
  getColumnStateForCurrentView: jest.fn(),
  setColumnStateForCurrentView: jest.fn(),
};

const mockLocalizationService = {
  locale$: of(AG_GRID_LOCALE_DE),
};

describe('BaseAgGridComponent', () => {
  let component: TestAgGridComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestAgGridComponent],
      providers: [
        { provide: AgGridStateService, useValue: mockAgGridStateService },
        { provide: LocalizationService, useValue: mockLocalizationService },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestAgGridComponent);
    component = fixture.componentInstance;
  });

  test('should create TestAgGridComponent', () => {
    expect(component).toBeTruthy();
  });

  test(
    'should initialize localeText$',
    marbles((m) => {
      component.ngOnInit();
      m.expect(component.localeText$).toBeObservable(
        m.cold('(a|)', { a: AG_GRID_LOCALE_DE })
      );
    })
  );

  test('should call agGridStateService methods in ngOnInit', () => {
    component.ngOnInit();
    expect(mockAgGridStateService.init).toHaveBeenCalledWith('TestTableKey');
    expect(mockAgGridStateService.setActiveView).toHaveBeenCalledWith(0);
  });

  test('onGridReady should apply column state if available', () => {
    const mockEvent = {
      api: { applyColumnState: jest.fn() },
    };

    mockAgGridStateService.getColumnStateForCurrentView.mockReturnValue(
      'state'
    );

    component.onGridReady(mockEvent as any);

    expect(
      mockAgGridStateService.getColumnStateForCurrentView
    ).toHaveBeenCalled();
    expect(mockEvent.api.applyColumnState).toHaveBeenCalledWith({
      state: 'state',
      applyOrder: true,
    });
  });

  test('onColumnChange should set column state', () => {
    const mockEvent = {
      api: {
        getColumnState: jest.fn().mockReturnValue('columnState'),
      },
    } as any;

    component.onColumnChange(mockEvent);

    expect(mockEvent.api.getColumnState).toHaveBeenCalled();
    expect(
      mockAgGridStateService.setColumnStateForCurrentView
    ).toHaveBeenCalledWith('columnState');
  });
});
