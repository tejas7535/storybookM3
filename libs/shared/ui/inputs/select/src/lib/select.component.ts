import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChildren,
} from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';

import { debounceTime, Subscription } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';

import { StringOption } from '@schaeffler/inputs';

import deJson from './i18n/de.json';
import enJson from './i18n/en.json';
import esJson from './i18n/es.json';
import frJson from './i18n/fr.json';
import ruJson from './i18n/ru.json';
import zhJson from './i18n/zh.json';

@Component({
  selector: 'schaeffler-select',
  templateUrl: './select.component.html',
})
export class SelectComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @Input() public appearance: 'fill' | 'outline' = 'fill';
  @Input() public label = '';
  @Input() public placeholder = '';
  @Input() public searchPlaceholder = '';
  @Input() public addEntryPlaceholder = '';
  @Input() public hint = '';

  @Input() public stringOptions!: StringOption[];
  @Input() public loading?: boolean;
  @Input() public error?: boolean;
  @Input() public multiple?: boolean;
  @Input() public noResultsText = 'No Results';
  @Input() public addEntry?: boolean;

  @Output() public readonly searchUpdated = new EventEmitter<string>();
  @Output() public readonly entryAdded = new EventEmitter<string>();
  @Output() public readonly optionRemoved = new EventEmitter<StringOption>();
  @Output() public readonly optionSelected = new EventEmitter<
    StringOption | StringOption[]
  >();

  @ViewChildren('selectOption') private readonly selectOptions!: MatOption[];

  @Input() public formControl = new FormControl();
  public searchControl = new FormControl();

  public addingEntry = false;

  private readonly subscription = new Subscription();

  public constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(deJson, 'de');
    this.translocoService.setTranslation(esJson, 'es');
    this.translocoService.setTranslation(frJson, 'fr');
    this.translocoService.setTranslation(ruJson, 'ru');
    this.translocoService.setTranslation(zhJson, 'zh');
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.formControl.valueChanges
        .pipe(debounceTime(100))
        .subscribe((value) => this.optionSelected.emit(value))
    );

    this.subscription.add(
      this.searchControl.valueChanges
        .pipe(debounceTime(500))
        .subscribe((value) =>
          this.searchUpdated.emit(value.length > 1 ? value : '')
        )
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onChange: (value: StringOption | StringOption[]) => void = () => {};

  public onTouched: () => void = () => {};

  public writeValue(input: StringOption | StringOption[]): void {
    this.formControl.setValue(input);
    this.onTouched();
    this.onChange(input);
  }

  public registerOnChange(fn: any): void {
    this.subscription.add(this.formControl.valueChanges.subscribe(fn));
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public select(matOption?: MatOption): void {
    matOption?.select();
  }

  public onSelectAllToggle(checked: boolean): void {
    if (checked) {
      this.selectOptions.map((option) => option.select());
    } else {
      this.selectOptions.map((option) => option.deselect());
    }
  }

  public onOptionRemoved(option: StringOption): void {
    this.optionRemoved.emit(option);
  }

  public onClickAddEntry(): void {
    this.addingEntry = true;
  }

  public onCancelAddEntry(): void {
    this.addingEntry = false;
  }

  public onConfirmAddEntry(value: string): void {
    this.entryAdded.emit(value);
    this.addingEntry = false;
  }

  public get currentValue(): string | string[] {
    if (this.multiple) {
      return this.formControl.value?.map(
        (option: StringOption) => option.title
      );
    }

    return this.formControl.value?.title;
  }

  public trackByFn(index: number): number {
    return index;
  }
}
