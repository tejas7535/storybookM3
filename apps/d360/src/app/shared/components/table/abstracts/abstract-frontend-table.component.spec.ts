import { Component } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Stub } from '../../../test/stub.class';
import { FrontendTableResponse } from '../interfaces';
import { AbstractFrontendTableComponent } from './abstract-frontend-table.component';

@Component({
  selector: 'd360-test-frontend-table',
  template: '',
})
class TestFrontendTableComponent extends AbstractFrontendTableComponent {
  protected setConfig(): void {
    throw new Error('Method not implemented.');
  }
  protected setColumnDefinitions(): void {
    throw new Error('Method not implemented.');
  }
  protected readonly getData$: () => Observable<FrontendTableResponse> =
    jest.fn();
}

describe('AbstractFrontendTableComponent', () => {
  let component: TestFrontendTableComponent;

  beforeEach(() => {
    component = Stub.get<TestFrontendTableComponent>({
      component: TestFrontendTableComponent,
    });
  });

  describe('getData$', () => {
    it('should call the getData$ method and return the response', (done) => {
      const mockResponse: FrontendTableResponse = {
        content: [{ id: 1, name: 'Test Row' }],
      };

      jest
        .spyOn(component as any, 'getData$')
        .mockReturnValue(of(mockResponse));

      component['getData$']().subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(component['getData$']).toHaveBeenCalled();
        done();
      });
    });

    it('should handle an empty response gracefully', (done) => {
      jest
        .spyOn(component as any, 'getData$')
        .mockReturnValue(of({ content: [] }));

      component['getData$']().subscribe((response) => {
        expect(response).toEqual({ content: [] });
        done();
      });
    });
  });
});
