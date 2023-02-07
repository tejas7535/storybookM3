import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'gq-global-search-results-preview-list-entry',
  templateUrl: './global-search-results-preview-list-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearchResultsPreviewListEntryComponent {
  @Input()
  materialNr: string;

  @Input()
  searchVal: string;

  @Output()
  itemSelected = new EventEmitter<string>();

  itemClicked() {
    this.itemSelected.emit(this.materialNr);
  }
}
