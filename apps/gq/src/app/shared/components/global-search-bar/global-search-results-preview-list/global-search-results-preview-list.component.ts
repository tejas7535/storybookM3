import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { IdValue } from '../../../models/search';

@Component({
  selector: 'gq-global-search-results-preview-list',
  templateUrl: './global-search-results-preview-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearchResultsPreviewListComponent {
  @Input()
  title: string;

  @Input()
  idValues: IdValue[];

  @Input()
  searchVal: string | string[];

  @Output()
  itemSelected = new EventEmitter<IdValue>();

  @Input()
  resultsAreFromLocalStorage: boolean;

  onItemSelected(idValue: IdValue) {
    this.itemSelected.emit(idValue);
  }

  getSearchVal(index: number): string {
    return Array.isArray(this.searchVal)
      ? this.searchVal[index] || ''
      : this.searchVal;
  }
}
