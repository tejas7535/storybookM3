import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs';

/**
 * CanComponentDeactivate Interface
 *
 * @export
 * @interface CanComponentDeactivate
 */
export interface CanComponentDeactivate {
  /**
   * canDeactivate method
   *
   * @return {(Observable<boolean> | Promise<boolean> | boolean)}
   * @memberof CanComponentDeactivate
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean;
}

/**
 * CanDeactivateGuard service.
 *
 * @export
 * @class CanDeactivateGuard
 * @implements {CanDeactivate<CanComponentDeactivate>}
 */
@Injectable({ providedIn: 'root' })
export class CanDeactivateGuard
  implements CanDeactivate<CanComponentDeactivate>
{
  /**
   * canDeactivate route guard function.
   *
   * @param {CanComponentDeactivate} component
   * @param {ActivatedRouteSnapshot} _currentRoute
   * @param {RouterStateSnapshot} _currentState
   * @param {RouterStateSnapshot} [_nextState]
   * @return {(boolean | Observable<boolean> | Promise<boolean>)}
   * @memberof CanDeactivateGuard
   */
  public canDeactivate(
    component: CanComponentDeactivate,
    _currentRoute: ActivatedRouteSnapshot,
    _currentState: RouterStateSnapshot,
    _nextState?: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return component && component.canDeactivate
      ? component.canDeactivate()
      : true;
  }
}
