import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { RequestType } from '../enums';
import { BackendTableResponse, RequestParams } from '../interfaces';
import { AbstractGeneralTableComponent } from './abstract-general-table.component';

@Component({ selector: 'd360-abstract-backend-table', template: '' })
export abstract class AbstractBackendTableComponent extends AbstractGeneralTableComponent {
  /**
   * The function to load data from the backend.
   *
   * @protected
   * @abstract
   * @memberof AbstractBackendTableComponent
   */
  protected abstract readonly getData$: (
    params: RequestParams,
    requestType: RequestType
  ) => Observable<BackendTableResponse>;
}
