/* tslint:disable:no-unused-variable */

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { GlobalSearchResultsItemComponent } from './global-search-results-item.component';

describe('GlobalSearchResultsItemComponent', () => {
  let component: GlobalSearchResultsItemComponent;
  let spectator: Spectator<GlobalSearchResultsItemComponent>;

  const createComponent = createComponentFactory({
    component: GlobalSearchResultsItemComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    declarations: [GlobalSearchResultsItemComponent],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
