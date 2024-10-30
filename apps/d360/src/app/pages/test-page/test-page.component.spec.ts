import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { SingleAutocompleteOnTypeComponent } from '../../shared/components/inputs/autocomplete/single-autocomplete-on-type/single-autocomplete-on-type.component';
import { SingleAutocompletePreLoadedComponent } from '../../shared/components/inputs/autocomplete/single-autocomplete-pre-loaded/single-autocomplete-pre-loaded.component';
import { TestPageComponent } from './test-page.component';

describe('TestPageComponent', () => {
  let spectator: Spectator<TestPageComponent>;

  const createComponent = createComponentFactory({
    component: TestPageComponent,
    imports: [
      MockComponent(SingleAutocompletePreLoadedComponent),
      MockComponent(SingleAutocompleteOnTypeComponent),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
