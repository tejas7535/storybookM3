import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { filterSelected } from '../core/store/actions';
import { AutocompleteInputModule } from '../shared/autocomplete-input/autocomplete-input.module';
import { Filter } from '../shared/models';
import { FilterSectionComponent } from './filter-section.component';

describe('FilterSectionComponent', () => {
  let component: FilterSectionComponent;
  let spectator: Spectator<FilterSectionComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: FilterSectionComponent,
    declarations: [FilterSectionComponent],
    imports: [
      NoopAnimationsModule,
      AutocompleteInputModule,
      provideTranslocoTestingModule({}),
      ReactiveComponentModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          employee: {
            filters: {
              organizations: [],
            },
          },
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set observables', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.organizations$).toBeDefined();
    });
  });

  describe('optionSelected', () => {
    test('should dispatch action', () => {
      const filter = new Filter('test', []);
      store.dispatch = jest.fn();

      component.optionSelected(filter);

      expect(store.dispatch).toHaveBeenCalledWith(filterSelected({ filter }));

      expect(component.organizations$).toBeDefined();
    });
  });
});
