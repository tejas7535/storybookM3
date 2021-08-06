import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { SearchAutocompleteModule } from '@schaeffler/search-autocomplete';

import { BearingComponent } from './bearing.component';

describe('BearingComponent', () => {
  let component: BearingComponent;
  let spectator: Spectator<BearingComponent>;

  const createComponent = createComponentFactory({
    component: BearingComponent,
    imports: [RouterTestingModule, SearchAutocompleteModule],
    providers: [
      provideMockStore({
        initialState: {
          bearing: {
            loading: false,
            result: undefined,
          },
        },
      }),
    ],
    declarations: [BearingComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
