import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { IdValue } from '../../../models/search';
import { GlobalSearchLastResultsService } from '../global-search-last-results-service/global-search-last-results.service';

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

  @Input()
  resultIsFromLocalStorage: boolean;

  @Output()
  itemSelected = new EventEmitter<IdValue>();

  constructor(
    private readonly lastResultsService: GlobalSearchLastResultsService
  ) {}

  removeFromLocalStorage(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.lastResultsService.removeResult(this.idValue);
  }

  itemClicked() {
    this.itemSelected.emit({ ...this.idValue, value2: this.searchVal });
  }
}
