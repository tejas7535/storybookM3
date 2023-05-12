import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { combineLatest, map, NEVER, Observable, startWith } from 'rxjs';

import { Approver } from '@gq/shared/models/quotation/approver.model';

import { ApproverDisplayPipe } from '../approver-display/approver-display.pipe';

const ITEM_HEIGHT = 50;
const MAX_ITEMS_IN_LIST_COUNT = 5;
@Component({
  selector: 'gq-release-modal-approver-select',
  templateUrl: './release-modal-approver-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleaseModalApproverSelectComponent implements OnInit {
  @Input()
  approverSelectFormControl: FormControl;
  @Input()
  title: string;
  @Input()
  approvers$: Observable<Approver[]>;
  @Input()
  errorMessage = '';

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  userDisplayPipe: ApproverDisplayPipe = new ApproverDisplayPipe();
  filteredOptions$: Observable<Approver[]> = NEVER;
  height = ITEM_HEIGHT * MAX_ITEMS_IN_LIST_COUNT;

  lastRenderedPosition = 0;

  ngOnInit(): void {
    this.filteredOptions$ = this.approvers$;
    this.addSubscription();
  }

  addSubscription() {
    this.filteredOptions$ = combineLatest([
      this.approverSelectFormControl.valueChanges.pipe(startWith('')),
      this.filteredOptions$,
    ]).pipe(
      map(([inputValue, filtered]) => this._filter(inputValue, filtered))
    );
  }

  scrollToFirstPosition(): void {
    // first we need to scroll to a position other than 0 otherwise we will see a blank list until scrolling is started again
    // to not jump through the list we scroll from 1 to 0
    this.virtualScroll.scrollToIndex(1);
    this.virtualScroll.scrollToIndex(0);
  }

  trackByFn(index: number): number {
    return index;
  }

  private _filter(
    inputValue: string | Approver,
    filtered: Approver[]
  ): Approver[] {
    // when approver is selected, no filter needed
    if (!inputValue || (inputValue as Approver)?.userId) {
      this.calculateHeightOfAutoCompletePanel(filtered.length);

      return filtered;
    }

    const results = filtered.filter((option) =>
      this.userDisplayPipe
        .transform(option)
        .toLowerCase()
        .trim()
        .includes(inputValue.toString()?.toLowerCase().trim())
    );

    this.calculateHeightOfAutoCompletePanel(results.length);

    return results;
  }

  private calculateHeightOfAutoCompletePanel(length: number): void {
    this.height =
      length < MAX_ITEMS_IN_LIST_COUNT
        ? ITEM_HEIGHT * length
        : ITEM_HEIGHT * MAX_ITEMS_IN_LIST_COUNT;
  }
}
