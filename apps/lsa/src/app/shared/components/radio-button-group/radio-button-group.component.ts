import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  distinctUntilChanged,
  map,
  Observable,
  shareReplay,
  startWith,
} from 'rxjs';

import { TAILWIND_SCREENS } from '@lsa/shared/constants';
import { PushPipe } from '@ngrx/component';

import { RadioOptionContentDirective } from './radio-option-content.directive';

@Component({
  selector: 'lsa-radio-button-group',
  standalone: true,
  imports: [
    CommonModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatDividerModule,
    PushPipe,
  ],
  templateUrl: './radio-button-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonGroupComponent<T> implements AfterContentInit {
  @Input() options: {
    value: T;
    name: string;
    disabled?: boolean;
    tooltip?: string;
    templateRef?: string;
  }[];
  @Input() control?: FormControl<T>;
  @Input() simplifiedMobile?: boolean;
  @Output() optionSelected = new EventEmitter<T>();

  @ContentChildren(RadioOptionContentDirective)
  templates!: QueryList<RadioOptionContentDirective>;

  isMediumScreen$: Observable<boolean> = this.breakpointObserver
    .observe([`(min-width: ${TAILWIND_SCREENS.MD})`])
    .pipe(map((state) => state.matches));

  templateMap: {
    [key: string]: {
      ref: TemplateRef<unknown>;
    };
  } = {};
  visibleTemplate$: Observable<
    typeof this.templateMap[keyof typeof this.templateMap] | undefined
  >;

  constructor(private readonly breakpointObserver: BreakpointObserver) {}

  ngAfterContentInit() {
    this.templateMap = {};
    this.templates.forEach((item) => {
      this.templateMap[item.name] = {
        ref: item.template,
      };
    });

    this.visibleTemplate$ = this.control.valueChanges.pipe(
      startWith(this.control.value),
      distinctUntilChanged(),
      shareReplay(1),
      map(
        (value) =>
          this.templateMap[
            this.options.find((option) => option.value === value)?.templateRef
          ]
      )
    );
  }

  onOptionSelected({ value }: MatRadioChange & { value: T }): void {
    this.control?.setValue(value);
    this.optionSelected.emit(value);
  }
}
