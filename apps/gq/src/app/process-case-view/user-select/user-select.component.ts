import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
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
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

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
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { UserDisplayPipe } from '@gq/shared/pipes/user-display/user-display.pipe';
import { PushPipe } from '@ngrx/component';

const ITEM_HEIGHT = 50;
const MAX_ITEMS_IN_LIST_COUNT = 5;

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ScrollingModule,
    MatInputModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    SharedPipesModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    PushPipe,
  ],
  selector: 'gq-user-select',
  templateUrl: './user-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSelectComponent implements AfterViewInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;
  @ViewChild('inputField') inputField: ElementRef<HTMLInputElement>;

  @Input() userSelectFormControl: FormControl;
  @Input() title: string;
  @Input() errorMessage = '';
  @Input() isLoading = false;
  @Input() inputChangedDebounceTime = 0;

  /**
   * If true, the loaded data is filtered using the input field value
   */
  @Input() enableFiltering = false;

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

  get users$(): Observable<ActiveDirectoryUser[]> {
    return this._users$;
  }

  @Input() set users$(users$: Observable<ActiveDirectoryUser[]>) {
    this.filteredOptions$ = users$.pipe(
      tap((users: ActiveDirectoryUser[]) =>
        this.calculateHeightOfAutoCompletePanel(users.length)
      )
    );
    this._users$ = users$;
  }

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
