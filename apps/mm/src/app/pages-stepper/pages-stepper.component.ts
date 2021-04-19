import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';

import { PageMetaStatus } from '@caeonline/dynamic-forms';

// TODO use Ids for active state
@Component({
  selector: 'mm-pages-stepper',
  templateUrl: './pages-stepper.component.html',
  styleUrls: ['./pages-stepper.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush, // TODO Enable when pageVisibility is async
})
export class PagesStepperComponent implements OnChanges {
  @Input() pages: PageMetaStatus[] = [];

  @Input() activePageId?: string;

  @Input() maxPageId?: string;

  @Input() inactivePageId?: string;

  @Output() activePageIdChange = new EventEmitter<string>();

  get hasNext(): boolean {
    const lastPage = this.getVisiblePages().slice(-1).pop();

    return lastPage && lastPage.id !== this.activePageId;
  }

  get hasResultNext(): boolean {
    const visiblePages = this.getVisiblePages();
    const currentPageIndex = visiblePages.findIndex(
      (visiblePage) => visiblePage.id === this.activePageId
    );
    const targetPageIndex = currentPageIndex + 1;

    return visiblePages[targetPageIndex].id === 'PAGE_RESULT';
  }

  get hasPrev(): boolean {
    const firstPage = this.getVisiblePages().slice(0, 1).pop();

    return firstPage && firstPage.id !== this.activePageId;
  }

  ngOnChanges(): void {
    this.pages = this.pages.filter((page) => page.isParent);
  }

  activate(page: PageMetaStatus): void {
    this.activePageIdChange.emit(page.id);
  }

  prev(): void {
    this.navigatePage(-1);
  }

  next(): void {
    this.navigatePage(1);
  }

  private navigatePage(direction: -1 | 1): void {
    const visiblePages = this.getVisiblePages();
    const currentPageIndex = visiblePages.findIndex(
      (visiblePage) => visiblePage.id === this.activePageId
    );
    const targetPageIndex = currentPageIndex + direction;
    if (
      currentPageIndex >= 0 &&
      targetPageIndex >= 0 &&
      targetPageIndex < visiblePages.length
    ) {
      this.activePageIdChange.emit(
        visiblePages[currentPageIndex + direction].id
      );
    }
  }

  private getVisiblePages(): PageMetaStatus[] {
    return this.pages.filter(
      (page) => page.visible && page.id !== this.inactivePageId
    );
  }
}
