import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetFilterComponent } from './reset-filter.component';

import { Filter, Worksheet } from '@tableau/extensions-api-types';

describe('ResetFilterComponent', () => {
  let component: ResetFilterComponent;
  let fixture: ComponentFixture<ResetFilterComponent>;

  Object.defineProperty(window, 'tableau', {
    value: {
      extensions: {
        dashboardContent: {
          dashboard: {
            worksheets: []
          }
        },
        initializeAsync: jest.fn().mockImplementation(() => Promise.resolve())
      }
    }
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResetFilterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getAllWorksheets', () => {
    it('should be defined', () => {
      expect(component.getAllWorksheets).toBeDefined();
    });
  });

  describe('resetFilters', () => {
    it('should be defined', async () => {
      const mockedWorksheets: Worksheet[] = [
        {
          getFiltersAsync: jest
            .fn()
            .mockImplementation(() => Promise.resolve(mockFilter)),
          clearFilterAsync: jest
            .fn()
            .mockImplementation(() => Promise.resolve()),
          parentDashboard: undefined,
          applyFilterAsync: undefined,
          applyRangeFilterAsync: undefined,
          getDataSourcesAsync: undefined,
          getHighlightedMarksAsync: undefined,
          getSelectedMarksAsync: undefined,
          getSummaryDataAsync: undefined,
          getUnderlyingDataAsync: undefined,
          selectMarksByIDAsync: undefined,
          selectMarksByValueAsync: undefined,
          name: undefined,
          sheetType: undefined,
          findParameterAsync: undefined,
          size: undefined,
          getParametersAsync: undefined,
          addEventListener: undefined,
          removeEventListener: undefined
        }
      ];

      const mockFilter: Filter[] = [
        {
          fieldName: 'mockFilterName',
          worksheetName: undefined,
          filterType: undefined,
          fieldId: undefined,
          getFieldAsync: undefined
        }
      ];

      component.worksheets = mockedWorksheets;

      expect(component.resetFilters).toBeDefined();

      await component.resetFilters();

      expect(component.worksheets[0].clearFilterAsync).toHaveBeenCalled();
    });
  });
});
