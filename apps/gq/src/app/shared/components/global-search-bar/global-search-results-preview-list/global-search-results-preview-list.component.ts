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
  idValues: IdValue[];

  @Input()
  searchVal: string;

  @Output()
  itemSelected = new EventEmitter<IdValue>();

  onItemSelected(idValue: IdValue) {
    this.itemSelected.emit(idValue);
  }
}
