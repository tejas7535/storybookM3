import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  Input,
  Optional,
  QueryList,
  Self,
  TemplateRef,
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroupDirective,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';

import { distinctUntilChanged, map, Observable, startWith } from 'rxjs';

import { NOOP_VALUE_ACCESSOR } from '../constants/input';
import { TAILWIND_SCREENS } from '../constants/screens';
import { RadioButtonComponent } from '../radio-button/radio-button.component';
import { TabbedSuboptionComponent } from '../tabbed-suboption/tabbed-suboption.component';
import { OptionTemplateDirective } from './option-template.directive';

@Component({
  selector: 'ea-tabbed-options',
  standalone: true,
  imports: [
    CommonModule,
    TabbedSuboptionComponent,
    MatRadioModule,
    OptionTemplateDirective,
    ReactiveFormsModule,
    MatDividerModule,
    RadioButtonComponent,
  ],
  templateUrl: './tabbed-options.component.html',
  styleUrls: ['./tabbed-options.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class TabbedOptionsComponent implements AfterContentInit {
  @Input() formControl: FormControl | undefined;

  @ContentChildren(OptionTemplateDirective)
  templates!: QueryList<OptionTemplateDirective>;

  isMediumScreen$: Observable<boolean> = this.breakpointObserver
    .observe([`(min-width: ${TAILWIND_SCREENS.MD})`])
    .pipe(map((state) => state.matches));

  templateMap: { [key: string]: TemplateRef<unknown> } = {};
  visibleTemplate$: Observable<TemplateRef<unknown> | undefined>;

  selectionOptions: { label: string; value: string }[] = [];

  constructor(
    @Self() @Optional() public ngControl: NgControl,
    private readonly breakpointObserver: BreakpointObserver
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = NOOP_VALUE_ACCESSOR;
    }
  }

  get control(): FormControl {
    return this.formControl || (this.ngControl?.control as FormControl);
  }

  ngAfterContentInit() {
    this.templateMap = {};
    this.templates.forEach((item) => {
      this.templateMap[item.name] = item.template;
    });

    this.selectionOptions = this.templates.map((item) => ({
      label: item.label || '',
      value: item.name || '',
    }));

    this.visibleTemplate$ = this.control.valueChanges.pipe(
      startWith(this.control.value),
      distinctUntilChanged(),
      map((value) => this.templateMap[value])
    );
  }
}
