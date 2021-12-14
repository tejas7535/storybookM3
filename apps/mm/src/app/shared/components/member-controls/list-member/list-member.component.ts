import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import {
  filter,
  map,
  Observable,
  of,
  startWith,
  Subject,
  takeUntil,
  withLatestFrom,
} from 'rxjs';

import {
  BearinxListValue,
  CONTROL_META,
  VariablePropertyMeta,
} from '@caeonline/dynamic-forms';
import { translate } from '@ngneat/transloco';

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
  public PROPERTY_PAGE_MOUNTING = PROPERTY_PAGE_MOUNTING;
  public PROPERTY_PAGE_MOUNTING_SITUATION_SUB =
    PROPERTY_PAGE_MOUNTING_SITUATION_SUB;

  public isBoolean = false;

  public options$: Observable<
    (BearinxListValue & {
      value: string;
      caption: string;
      imageUrl: string;
    })[]
  > = of([]);

  public isPictureList$: Observable<boolean>;

  private readonly destroy$ = new Subject<void>();

  public constructor(
    @Inject(CONTROL_META) public readonly meta: VariablePropertyMeta
  ) {}

  public ngOnInit(): void {
    if (this.meta.member.type === MemberTypes.Boolean) {
      this.isBoolean = true;

      return;
    }

    const listValues$ = this.meta.listValues$ ?? of([]);

    this.isPictureList$ = listValues$.pipe(
      map((options: any[]) => options.some((option: any) => option.imageUrl))
    );

    this.setupOptions(listValues$);
    this.connectRuntime();
    this.preselectOnlyOption();
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

  public translationRequired(type: string, id: string): boolean {
    return (
      (!this.isDropdownInput(type, id) && !(type === MemberTypes.LazyList)) ||
      type === MemberTypes.List
    );
  }

  private connectRuntime(): void {
    const runtime = this.meta.runtime;
    if (runtime) {
      this.control.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: any) => {
          runtime(value);
        });
    }
  }

  private setupOptions(listValues$: Observable<BearinxListValue[]>): void {
    this.options$ = listValues$.pipe(
      map((listValues: any[]) =>
        listValues.map((listValue: any) => ({
          ...listValue,
          value:
            this.translationRequired(
              this.meta.member.type,
              this.meta.member.id
            ) &&
            !(this.meta.member.type === MemberTypes.List && listValue.imageUrl)
              ? translate(listValue.text)
              : listValue.text,
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
          options.every((option: any) => option.id !== value)
        )
      )
      .subscribe(([_, options]: [any, any[]]) => {
        const { defaultValue } = this.meta.member;
        if (options.some(({ id }) => id === defaultValue)) {
          this.control.setValue(defaultValue);
          this.meta.control?.get('initialValue')?.setValue(defaultValue);
        }
      });
  }

  private preselectOnlyOption(): void {
    this.options$.pipe(takeUntil(this.destroy$)).subscribe((options) => {
      if (options.length === 1) {
        this.control.patchValue(options[0].id);
        this.meta.control?.get('value')?.setValue(options[0].id);
      }
    });
  }
}
