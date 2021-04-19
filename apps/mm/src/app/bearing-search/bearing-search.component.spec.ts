import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

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

      MatAutocompleteModule,
      MatInputModule,
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

  test('displayValue should return the option title', () => {
    const mockOption = {
      id: 'mockId',
      title: 'mockTitle',
    };

    expect(component.displayValue(mockOption)).toEqual('mockTitle');
  });

  test('selectBearing should emit the bearing', () => {
    // tslint:disable-next-line: no-object-literal-type-assertion
    const mockEvent = {
      option: {
        value: {
          id: 'mockAutoCompleteId',
        },
      },
    } as MatAutocompleteSelectedEvent;
    const spy = jest.spyOn(component.bearing, 'emit');

    component.selectBearing(mockEvent);

    expect(spy).toHaveBeenCalledWith('mockAutoCompleteId');
  });
});
