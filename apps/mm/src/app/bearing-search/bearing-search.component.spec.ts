import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

import { SearchAutocompleteModule } from '@schaeffler/search-autocomplete';

import { environment } from '../../environments/environment';
import { BearingSearchComponent } from './bearing-search.component';

describe('BearingSearchComponent', () => {
  let component: BearingSearchComponent;
  let spectator: Spectator<BearingSearchComponent>;
  let httpMock: HttpTestingController;

  const createComponent = createComponentFactory({
    component: BearingSearchComponent,
    imports: [
      HttpClientTestingModule,
      ReactiveFormsModule,

      ReactiveComponentModule,

      SearchAutocompleteModule,
    ],
    declarations: [BearingSearchComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('getBearings should trigger a search result http GET request', () => {
    const mock = {
      data: [
        {
          data: {
            title: 'mockTitle',
            id: 'mockId',
          },
        },
      ],
    };
    const mockSearchQuery = 'irgendNQuatsch';

    component.getBearings(mockSearchQuery).subscribe((response) => {
      expect(response).toEqual([{ title: 'mockTitle', id: 'mockId' }]);
    });

    const req = httpMock.expectOne(
      `${environment.apiMMBaseUrl}/bearing/search/?pattern=${mockSearchQuery}&page=1&size=1000`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  test('handleSelection should emit the bearing', () => {
    const mockSelectionId = 'mockAutoCompleteId';
    const spy = jest.spyOn(component.bearing, 'emit');

    component.handleSelection(mockSelectionId);

    expect(spy).toHaveBeenCalledWith('mockAutoCompleteId');
  });
});
