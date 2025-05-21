import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { FrontendTableResponse } from '../interfaces';
import { AbstractGeneralTableComponent } from './abstract-general-table.component';

@Component({ selector: 'd360-abstract-frontend-table', template: '' })
export abstract class AbstractFrontendTableComponent extends AbstractGeneralTableComponent {
  /**
   * The function to load data from the backend.
   *
   * @protected
   * @abstract
   * @memberof AbstractFrontendTableComponent
   */
  protected abstract readonly getData$: () => Observable<FrontendTableResponse>;
}
