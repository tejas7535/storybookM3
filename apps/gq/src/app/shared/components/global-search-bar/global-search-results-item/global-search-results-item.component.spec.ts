/* tslint:disable:no-unused-variable */
import { async, TestBed } from '@angular/core/testing';

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GlobalSearchResultsItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
