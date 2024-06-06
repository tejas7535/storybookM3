import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { map, Observable, take, tap } from 'rxjs';

import { PushPipe } from '@ngrx/component';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import { MsdDataService } from '@mac/msd/services';
import { DataFacade } from '@mac/msd/store/facades/data';

import { ChangeHistoryItem } from './models/change-history-item';
import { CHANGE_STATUS } from './models/change-status';
import { PropertyChange } from './models/property-change';

@Component({
  // this is needed or the auto-height option will not work!
  styles: [':host { @apply inline-block; }'],
  selector: 'mac-detail-cell-renderer',
  standalone: true,
  imports: [
    // default
    CommonModule,
    // libs
    SharedTranslocoModule,
    // ngrx
    PushPipe,
  ],
  templateUrl: './detail-cell-renderer.component.html',
})
export class DetailCellRendererComponent implements ICellRendererAngularComp {
  public changes: ChangeHistoryItem[] = [];
  public initial: ChangeHistoryItem;
  public done$: Observable<any[]>;

  /*
   * steel material specific: productCategory -> productCategoryText will be used
   */
  private readonly IGNORE_COLUMNS = new Set([
    'lastModified',
    'modifiedBy',
    'productCategory',
  ]);

  private materialClass: MaterialClass;
  private navigationLevel: NavigationLevel;

  constructor(
    private readonly dataFacade: DataFacade,
    private readonly msdDataService: MsdDataService
  ) {
    // default values
    this.materialClass = MaterialClass.STEEL;
    this.navigationLevel = NavigationLevel.MATERIAL;
    // subscription
    this.dataFacade.navigation$.subscribe((navigation) => {
      this.materialClass = navigation.materialClass;
      this.navigationLevel = navigation.navigationLevel;
    });
  }

  refresh(): boolean {
    return false;
  }

  agInit(params: ICellRendererParams): void {
    this.done$ = this.getObservable(params.data).pipe(
      take(1),
      tap((results) => {
        let current = results.shift();
        for (const previous of results) {
          this.changes.push({
            modifiedBy: current.modifiedBy,
            timestamp: new Date(current.lastModified * 1000),
            changes: this.compare(previous, current),
          });
          current = previous;
        }
        this.initial = {
          modifiedBy: current.modifiedBy,
          timestamp: new Date(current.lastModified * 1000),
          changes: [],
        };
      })
    );
  }

  private getObservable(data: any): Observable<any[]> {
    return this.materialClass === MaterialClass.SAP_MATERIAL
      ? this.msdDataService.getHistoryForSAPMaterial(
          data.materialNumber,
          data.supplierId,
          data.plant
        )
      : this.getHistory(data.id);
  }

  private getHistory(id: number): Observable<any[]> {
    switch (this.navigationLevel) {
      case NavigationLevel.STANDARD: {
        return this.msdDataService
          .getHistoryForMaterialStandard(this.materialClass, id)
          .pipe(map((std) => this.msdDataService.mapStandardsToTableView(std)));
      }
      case NavigationLevel.SUPPLIER: {
        return this.msdDataService
          .getHistoryForManufacturerSupplier(this.materialClass, id)
          .pipe(
            map((suppliers) =>
              this.msdDataService.mapSuppliersToTableView(suppliers)
            )
          );
      }
      case NavigationLevel.MATERIAL: {
        return this.msdDataService.getHistoryForMaterial(
          this.materialClass,
          id
        );
      }
      default: {
        return this.msdDataService.getHistoryForMaterial(
          this.materialClass,
          id
        );
      }
    }
  }

  /**
   * Compares the previous state of an object with the current, listing all property changes.
   *
   * @param previous previous state of object
   * @param current current state of object
   * @returns list of changes
   */
  private compare(previous: any, current: any): PropertyChange[] {
    const changes: PropertyChange[] = [];
    this.removeUndefined(previous);
    this.removeUndefined(current);
    for (const property in previous) {
      // ignore properties from the ignore list
      if (this.IGNORE_COLUMNS.has(property)) {
        continue;
      }
      // check for removed properties
      // eslint-disable-next-line no-prototype-builtins
      if (!current.hasOwnProperty(property)) {
        changes.push({
          property,
          previous: previous[property],
          reason: CHANGE_STATUS.REMOVE,
        });
      }
      // check for updated values
      else if (
        JSON.stringify(current[property]) !== JSON.stringify(previous[property])
      ) {
        changes.push({
          property,
          previous: previous[property],
          current: current[property],
          reason: CHANGE_STATUS.UPDATE,
        });
      }
    }
    for (const property in current) {
      // check for added properties
      if (
        !this.IGNORE_COLUMNS.has(property) &&
        // eslint-disable-next-line no-prototype-builtins
        !previous.hasOwnProperty(property)
      ) {
        // check for added properties
        changes.push({
          property,
          current: current[property],
          reason: CHANGE_STATUS.ADD,
        });
      }
    }

    return changes;
  }

  /**
   * remove properties with undefined values
   * @param obj object to "clean"
   */
  private removeUndefined(obj: any): any {
    for (const property in obj) {
      if (!obj[property]) {
        delete obj[property];
      }
    }
  }
}
