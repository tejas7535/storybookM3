import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { IdValue } from '../../../models/search';

@Component({
  selector: 'gq-global-search-results-preview-list-entry',
  templateUrl: './global-search-results-preview-list-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearchResultsPreviewListEntryComponent {
  @Input()
  idValue: IdValue;

  @Input()
  searchVal: string;

  @Output()
  itemSelected = new EventEmitter<IdValue>();

  itemClicked() {
    this.itemSelected.emit(this.idValue);
  }
}
