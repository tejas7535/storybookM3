import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'gq-global-search-results-preview-list',
  templateUrl: './global-search-results-preview-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearchResultsPreviewListComponent {
  @Input()
  materialNumbers: string[];

  @Input()
  searchVal: string;

  @Output()
  itemSelected = new EventEmitter<string>();

  onItemSelected(materialNr: string) {
    this.itemSelected.emit(materialNr);
  }
}
