import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable, of, Subject } from 'rxjs';
import {
  filter,
  map,
  startWith,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';

import {
  BearinxListValue,
  CONTROL_META,
  VariablePropertyMeta,
} from '@caeonline/dynamic-forms';

import {
  MemberTypes,
  PROPERTY_PAGE_MOUNTING,
  PROPERTY_PAGE_MOUNTING_SITUATION_SUB,
} from '../../../constants/dialog-constant';
import { forcedSelectsList } from '../../../constants/forced-selects-list';

@Component({
  templateUrl: 'list-member.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListMemberComponent implements OnInit, OnDestroy {
  public constructor(
    @Inject(CONTROL_META) public readonly meta: VariablePropertyMeta
  ) {}

  public PROPERTY_PAGE_MOUNTING = PROPERTY_PAGE_MOUNTING;
  public PROPERTY_PAGE_MOUNTING_SITUATION_SUB =
    PROPERTY_PAGE_MOUNTING_SITUATION_SUB;

  public isBoolean = false;

  public options$: Observable<(BearinxListValue & { value: string })[]> = of(
    []
  );

  public isPictureList$: Observable<boolean>;

  private readonly destroy$ = new Subject<void>();

  public ngOnInit(): void {
    if (this.meta.member.type === MemberTypes.Boolean) {
      this.isBoolean = true;

      return;
    }

    const listValues$ = this.meta.listValues$ ?? of([]);

    this.isPictureList$ = listValues$.pipe(
      map((options) => options.some((option) => option.imageUrl))
    );

    this.setupOptions(listValues$);
    this.connectRuntime();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public isDropdownInput(type: string, id: string): boolean {
    return type === MemberTypes.LazyList && !forcedSelectsList.includes(id);
  }

  public get control(): FormControl {
    return (
      (this.meta.control?.get('value') as FormControl) || new FormControl('')
    );
  }

  private connectRuntime(): void {
    const runtime = this.meta.runtime;
    if (runtime) {
      this.control.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          runtime(value);
        });
    }
  }

  private setupOptions(listValues$: Observable<BearinxListValue[]>): void {
    this.options$ = listValues$.pipe(
      map((listValues) =>
        listValues.map((listValue) => ({
          ...listValue,
          value: listValue.text,
        }))
      )
    );

    // Set to the default value when current value is not part of the options
    this.control.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        startWith(this.control.value),
        withLatestFrom(this.options$),
        filter(([value, options]) =>
          options.every((option) => option.id !== value)
        )
      )
      .subscribe(([_, options]) => {
        const { defaultValue } = this.meta.member;
        if (options.some(({ id }) => id === defaultValue)) {
          this.control.setValue(defaultValue);
          this.meta.control?.get('initialValue')?.setValue(defaultValue);
        }
      });
  }
}
