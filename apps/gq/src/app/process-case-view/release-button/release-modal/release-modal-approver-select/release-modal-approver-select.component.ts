import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
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

  userDisplayPipe: ApproverDisplayPipe = new ApproverDisplayPipe();
  filteredOptions$: Observable<Approver[]> = NEVER;
  height = ITEM_HEIGHT * MAX_ITEMS_IN_LIST_COUNT;

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

  trackByFn(index: number): number {
    return index;
  }

  private _filter(
    inputValue: string | Approver,
    filtered: Approver[]
  ): Approver[] {
    if (!inputValue) {
      return filtered;
    }
    // when user selects an approver from the list, no need to filter
    if ((inputValue as Approver)?.userId) {
      return filtered;
    }

    const results = filtered.filter((option) =>
      this.userDisplayPipe
        .transform(option)
        .toLowerCase()
        .trim()
        .includes(inputValue.toString()?.toLowerCase().trim())
    );

    this.height =
      results.length < MAX_ITEMS_IN_LIST_COUNT
        ? ITEM_HEIGHT * results.length
        : ITEM_HEIGHT * MAX_ITEMS_IN_LIST_COUNT;

    return results;
  }
}
