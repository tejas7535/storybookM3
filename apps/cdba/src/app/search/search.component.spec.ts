import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { BlockUiModule } from '@cdba/shared/components';

import { getReferenceTypes, getSearchSuccessful } from '../core/store';
import { SharedModule } from '../shared/shared.module';
import { FilterPanelModule } from './filter-panel/filter-panel.module';
import { ReferenceTypesFiltersModule } from './reference-types-filters/reference-types-filters.module';
import { ReferenceTypesTableModule } from './reference-types-table/reference-types-table.module';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let spectator: Spectator<SearchComponent>;

  const createComponent = createComponentFactory({
    component: SearchComponent,
    imports: [
      SharedModule,
      provideTranslocoTestingModule({}),
      MockModule(FilterPanelModule),
      MockModule(ReferenceTypesFiltersModule),
      MockModule(ReferenceTypesTableModule),
      RouterTestingModule,
      BlockUiModule,
    ],
    providers: [
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
    disableAnimations: true,
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
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
