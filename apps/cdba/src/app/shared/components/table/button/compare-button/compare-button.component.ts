import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Params, Router } from '@angular/router';

import { TranslocoService } from '@jsverse/transloco';
import { IRowNode } from 'ag-grid-community';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import {
  COMPARE_ITEMS_MAX_COUNT,
  COMPARE_ITEMS_MIN_COUNT,
} from '@cdba/shared/constants/table';
import { isDetailRoute } from '@cdba/shared/utils';

@Component({
  selector: 'cdba-compare-button',
  templateUrl: './compare-button.component.html',
})
export class CompareButtonComponent implements OnChanges {
  @Input()
  selectedNodes: IRowNode[];

  minCount = COMPARE_ITEMS_MIN_COUNT;
  maxCount = COMPARE_ITEMS_MAX_COUNT;

  constructor(
    private readonly router: Router,
    private readonly transloco: TranslocoService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedNodes = changes.selectedNodes.currentValue;
  }

  getTooltip(): string {
    return this.selectedNodes?.length < this.minCount
      ? this.transloco.translate('shared.statusBar.hints.minCount', {
          count: this.minCount,
        })
      : this.transloco.translate('shared.statusBar.hints.maxCount', {
          count: this.maxCount,
        });
  }

  showCompareView(): void {
    const queryParams: Params = {};
    const route: string[] = [AppRoutePath.ComparePath];

    const currentPath = this.router.routerState.snapshot.url.split('?')[0];

    this.selectedNodes.forEach((selection: IRowNode, index: number) => {
      queryParams[`material_number_item_${index + 1}`] =
        selection.data.materialNumber;
      queryParams[`plant_item_${index + 1}`] = selection.data.plant;
      queryParams[`node_id_item_${index + 1}`] = isDetailRoute(currentPath)
        ? selection.id
        : undefined;
    });

    this.router.navigate(route, {
      queryParams,
    });
  }
}
