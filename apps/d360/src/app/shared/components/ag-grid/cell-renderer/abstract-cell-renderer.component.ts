import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-enterprise';

/**
 * This is the abstract base cell renderer.
 *
 * @export
 * @class AbstractBaseCellRendererComponent
 * @implements {ICellRendererAngularComp}
 * @template T
 */
@Component({ template: '' })
export abstract class AbstractBaseCellRendererComponent<T = any>
  implements ICellRendererAngularComp
{
  /**
   * The value to show up.
   *
   * @type {*}
   * @memberof AbstractBaseCellRendererComponent
   */
  public value: any;

  /**
   * Some additional data.
   *
   * @protected
   * @type {Record<string, any>}
   * @memberof AbstractBaseCellRendererComponent
   */
  protected refData: Record<string, any> = {};

  /**
   * The passed parameters.
   *
   * @protected
   * @type {(ICellRendererParams<any, T, any> | undefined)}
   * @memberof AbstractBaseCellRendererComponent
   */
  protected parameters: ICellRendererParams<any, T> | undefined;

  /**
   * Set init value.
   *
   * @param {ICellRendererParams<any, T, any>} parameters
   * @memberof AbstractBaseCellRendererComponent
   */
  public agInit(parameters: ICellRendererParams<any, T>): void {
    this.parameters = parameters;
    this.refData = parameters.colDef?.refData ?? {};
    this.setValue(parameters);
  }

  /**
   * Set refresh value.
   *
   * @returns {boolean}
   * @memberof AbstractBaseCellRendererComponent
   */
  public refresh(): boolean {
    return false;
  }

  /**
   * Set the value to show up.
   *
   * @private
   * @memberof AbstractBaseCellRendererComponent
   */
  protected abstract setValue(parameters: ICellRendererParams<any, T>): void;
}
