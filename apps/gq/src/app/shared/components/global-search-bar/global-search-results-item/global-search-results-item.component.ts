import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { GlobalSearchResultsItem } from './model/global-search-results-item.model';
@Component({
  selector: 'gq-global-search-results-item',
  templateUrl: './global-search-results-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearchResultsItemComponent {
  @Input() searchResult: GlobalSearchResultsItem;
  @Output() gqIdSelected = new EventEmitter<number>();
}
