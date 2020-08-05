import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { AgGridModule } from '@ag-grid-community/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { getReferenceTypes, getSearchSuccessful } from '../core/store';
import { BlockUiModule } from '../shared/block-ui/block-ui.module';
import { AgGridStateService } from '../shared/services/ag-grid-state.service';
import { SharedModule } from '../shared/shared.module';
import { CustomNoRowsOverlayComponent } from '../shared/table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import { CustomOverlayModule } from '../shared/table/custom-overlay/custom-overlay.module';
import { FilterPanelModule } from './filter-panel/filter-panel.module';
import { ReferenceTypesFiltersModule } from './reference-types-filters/reference-types-filters.module';
import { ReferenceTypesTableModule } from './reference-types-table/reference-types-table.module';
import { SearchComponent } from './search.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        SharedModule,
        provideTranslocoTestingModule({}),
        FilterPanelModule,
        ReferenceTypesFiltersModule,
        ReferenceTypesTableModule,
        RouterTestingModule,
        AgGridModule.withComponents([CustomNoRowsOverlayComponent]),
        BlockUiModule,
        CustomOverlayModule,
      ],
      declarations: [SearchComponent],
      providers: [
        AgGridStateService,
        provideMockStore({
          initialState: {
            search: {},
          },
          selectors: [
            {
              selector: getSearchSuccessful,
              value: true,
            },
            {
              selector: getReferenceTypes,
              value: [],
            },
          ],
        }),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should initialize observables', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.searchSuccessful$).toBeDefined();
    });
  });
});
