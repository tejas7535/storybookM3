import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import {
  debounceTime,
  fromEvent,
  map,
  NEVER,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

import { ActiveDirectoryUser } from '@gq/shared/models';

import { UserDisplayPipe } from '../user-display/user-display.pipe';

const ITEM_HEIGHT = 50;
const MAX_ITEMS_IN_LIST_COUNT = 5;

@Component({
  selector: 'gq-release-modal-user-select',
  templateUrl: './release-modal-user-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleaseModalUserSelectComponent
  implements AfterViewInit, OnDestroy
{
  @Input() userSelectFormControl: FormControl;
  @Input() title: string;
  @Input() errorMessage = '';
  @Input() isLoading = false;
  @Input() inputChangedDebounceTime = 0;

  /**
   * If true, the loaded data is filtered using the input field value
   */
  @Input() enableFiltering = false;

  @Input() set users$(users$: Observable<ActiveDirectoryUser[]>) {
    this.filteredOptions$ = users$.pipe(
      tap((users: ActiveDirectoryUser[]) =>
        this.calculateHeightOfAutoCompletePanel(users.length)
      )
    );
    this._users$ = users$;
  }

  get users$(): Observable<ActiveDirectoryUser[]> {
    return this._users$;
  }

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;
  @ViewChild('inputField') inputField: ElementRef<HTMLInputElement>;

  /**
   * Will be emmited as soon as the user changes the input field value and after the defined {@link inputChangedDebounceTime} in milliseconds.
   *
   * Payload of the event is the current value, entered by the user.
   */
  @Output() inputChanged: EventEmitter<string> = new EventEmitter();

  userDisplayPipe: UserDisplayPipe = new UserDisplayPipe();
  filteredOptions$: Observable<ActiveDirectoryUser[]> = NEVER;
  height = ITEM_HEIGHT * MAX_ITEMS_IN_LIST_COUNT;

  lastRenderedPosition = 0;

  private _users$: Observable<ActiveDirectoryUser[]>;
  private readonly shutdown$$: Subject<void> = new Subject<void>();

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    fromEvent<InputEvent>(this.inputField.nativeElement, 'input')
      .pipe(
        debounceTime(this.inputChangedDebounceTime),
        takeUntil(this.shutdown$$)
      )
      .subscribe((inputEvent: InputEvent) => {
        const inputFieldValue = (
          inputEvent.target as HTMLInputElement
        ).value.trim();

        if (this.enableFiltering) {
          this.filteredOptions$ = this.users$.pipe(
            map((users: ActiveDirectoryUser[]) =>
              this._filter(inputFieldValue, users)
            )
          );
          this.changeDetectorRef.detectChanges();
        }

        this.inputChanged.emit(inputFieldValue);
      });
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

  ngOnDestroy(): void {
    this.shutdown$$.next();
    this.shutdown$$.complete();
  }

  private _filter(
    inputValue: string,
    filtered: ActiveDirectoryUser[]
  ): ActiveDirectoryUser[] {
    // when input field is empty, no filter needed
    if (!inputValue) {
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
