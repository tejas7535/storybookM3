import { Component } from '@angular/core';

import { Observable, of, take } from 'rxjs';

import { Stub } from '../../../test/stub.class';
import { RequestType } from '../enums';
import { BackendTableResponse, RequestParams } from '../interfaces';
import { AbstractBackendTableComponent } from './abstract-backend-table.component';

@Component({
  selector: 'd360-test-backend-table',
  template: '',
})
class TestBackendTableComponent extends AbstractBackendTableComponent {
  protected setConfig(): void {
    throw new Error('Method not implemented.');
  }
  protected setColumnDefinitions(): void {
    throw new Error('Method not implemented.');
  }
  protected readonly getData$: (
    params: RequestParams,
    requestType: RequestType
  ) => Observable<BackendTableResponse> = jest.fn().mockImplementation(() =>
    of({
      rows: [],
      rowCount: 0,
    })
  );
}

describe('AbstractBackendTableComponent', () => {
  let component: TestBackendTableComponent;

  beforeEach(() => {
    component = Stub.get<TestBackendTableComponent>({
      component: TestBackendTableComponent,
    });
  });

  describe('getData$', () => {
    it('should call the getData$ method with correct parameters', (done) => {
      const mockParams: RequestParams = {
        startRow: 0,
        endRow: 10,
        sortModel: [],
        columnFilters: {},
      } as any;
      const mockRequestType: RequestType = RequestType.Fetch;
      const mockResponse: BackendTableResponse = {
        rows: [{ id: 1, name: 'Test Row' }],
        rowCount: 1,
      };

      jest
        .spyOn(component as any, 'getData$')
        .mockReturnValue(of(mockResponse));

      component['getData$'](mockParams, mockRequestType)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual(mockResponse);
          done();
        });
    });

    it('should handle an empty response gracefully', (done) => {
      const mockParams: RequestParams = {
        startRow: 0,
        endRow: 10,
        sortModel: [],
        columnFilters: {},
      } as any;
      const mockRequestType: RequestType = RequestType.GroupClick;

      jest
        .spyOn(component as any, 'getData$')
        .mockReturnValue(of({ rows: [], rowCount: 0 }));

      component['getData$'](mockParams, mockRequestType).subscribe(
        (response) => {
          expect(response).toEqual({ rows: [], rowCount: 0 });
          done();
        }
      );
    });
  });
});
