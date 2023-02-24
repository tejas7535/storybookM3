import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import { QuotationSearchResult } from '../../../models/quotation';

const INITIAL_ROW_COUNT = 3;
@Component({
  selector: 'gq-global-search-results-list',
  templateUrl: './global-search-results-list.component.html',
})
export class GlobalSearchResultsListComponent {
  @Input() gqCases: QuotationSearchResult[];
  @Input() searchVal = '';
  @Output() gqIdSelected = new EventEmitter<QuotationSearchResult>();
  @Output() openInTabClicked = new EventEmitter<QuotationSearchResult>();
  @Output() openInWindowClicked = new EventEmitter<QuotationSearchResult>();

  public count = INITIAL_ROW_COUNT;

  public contextMenuPosition: { x: number; y: number } = { x: 0, y: 0 };
  @ViewChild(MatMenuTrigger) public contextMenu: MatMenuTrigger;

  /**
   * increase the count of items to display
   */
  public increaseCount(): void {
    this.count = this.gqCases
      ? Math.min(this.count + 5, this.gqCases.length)
      : 0;
  }

  public showContextMenu(event: MouseEvent, item: QuotationSearchResult): void {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX;
    this.contextMenuPosition.y = event.clientY;
    this.contextMenu.menuData = { item };
    this.contextMenu.openMenu();
  }
}
