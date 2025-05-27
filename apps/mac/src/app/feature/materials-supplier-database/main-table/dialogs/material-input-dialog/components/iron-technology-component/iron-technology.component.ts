import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { filter, map, Observable, Subject, takeUntil } from 'rxjs';

import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ErrorMessagePipe } from '@mac/feature/materials-supplier-database/main-table/pipes/error-message-pipe/error-message.pipe';
import { DialogFacade } from '@mac/feature/materials-supplier-database/store/facades/dialog';

import { DialogControlsService } from '../../services';

interface Configuration {
  tech: string;
  cmnt: FormControl;
  ctrl: FormControl;
  observable: Observable<any>;
}

@Component({
  selector: 'mac-iron-technology',
  templateUrl: './iron-technology.component.html',
  imports: [
    // default
    CommonModule,
    // angular material
    MatAutocompleteModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    // forms
    ReactiveFormsModule,
    // libs
    SharedTranslocoModule,
    // pipes
    PushPipe,
    ErrorMessagePipe,
  ],
})
export class IronTechnologyComponent implements OnInit, OnDestroy {
  // get form fields from dialog as inputs
  @Input()
  public ironTechnologyGroup: FormGroup;
  @Input()
  public steelTechnologyControl: FormControl;
  @Input()
  public steelTechnologyCommentControl: FormControl;
  @Input()
  public disableControl: FormControl;

  // facade inputs
  public steelTechnologyComments$ =
    this.dialogFacade.processTechnologyComments$;

  // view configuration & control
  public config: Configuration[] = [];
  public ironMakingControl = this.controlsService.getControl<boolean>(
    false,
    true
  );
  public steelMakingControl = this.controlsService.getControl<boolean>(
    false,
    true
  );
  public readonly steelTechnologies = ['bof', 'eaf', 'eof', 'vim', 'oth'];

  private readonly ironTechnologies = ['bf', 'dr', 'sr', 'er', 'oth'];
  private readonly checkboxGroup: FormGroup = new FormGroup({});
  private readonly destroy$ = new Subject<void>();

  public constructor(
    readonly controlsService: DialogControlsService,
    readonly dialogFacade: DialogFacade
  ) {}

  ngOnInit(): void {
    this.prepareSteel();
    this.prepareIron();

    // reset data if ironmaking checkbox is unchecked
    this.ironMakingControl.valueChanges
      .pipe(
        takeUntil(this.destroy$)
        // filter((value) => !value)
      )
      .subscribe((enabled) => {
        this.ironTechnologyGroup.updateValueAndValidity();
        if (!enabled) {
          this.checkboxGroup.reset();
        }
      });

    // set validators for steel making
    this.steelMakingControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((enabled) => {
        if (enabled) {
          this.steelTechnologyControl.addValidators(Validators.required);
        } else {
          this.steelTechnologyControl.removeValidators(Validators.required);
          this.steelTechnologyControl.reset();
          this.steelTechnologyCommentControl.reset();
        }
        this.steelTechnologyControl.updateValueAndValidity();
      });

    // fetch comments after selecting a technology
    this.steelTechnologyControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((technology) => {
        if (technology) {
          this.dialogFacade.fetchProcessTechnologyComments(technology);
          this.steelTechnologyCommentControl.reset();
        }
      });

    // check updates on this form and disable all controls
    this.disableControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((enabled) => {
        if (enabled) {
          this.ironMakingControl.enable();
          this.steelMakingControl.enable();
        } else {
          this.ironMakingControl.reset();
          this.steelMakingControl.reset();
          this.ironMakingControl.disable();
          this.steelMakingControl.disable();
        }
      });
    this.disableControl.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private prepareSteel(): void {
    // check steel making if value has been set (by edit / copy)
    if (this.steelTechnologyControl.value) {
      this.steelMakingControl.setValue(true);
    }
  }

  private prepareIron(): void {
    // create a base observable containing all comments for all technologies
    const base = this.dialogFacade.processJsonComments$.pipe(
      takeUntil(this.destroy$),
      filter(Boolean)
    );

    // create control objects for each technology
    this.config = this.ironTechnologies.map((tech) =>
      this.mapToConfig(tech, base)
    );
    // add the controls to the form group and initialize subscriptions and dependencies
    this.config.forEach((config) => this.link(config));
    this.ironTechnologyGroup.addValidators(this.checkboxCheckedValidator());
  }

  // create a configuration object for each technology
  private mapToConfig(tech: string, base: Observable<any>): Configuration {
    return {
      tech,
      cmnt: this.controlsService.getControl<string>(),
      ctrl: this.controlsService.getControl<boolean>(false),
      observable: base.pipe(map((comments: any) => comments?.[tech] || [])),
    };
  }

  // setup all controls and subscriptions for each iron technology
  private link(config: Configuration): void {
    // check for prefilled values due to edit/copy, and cache values.
    const prefilled = this.ironTechnologyGroup.controls[
      config.tech
    ] as FormControl<string>;
    this.checkboxGroup.addControl(config.tech, config.ctrl);

    config.ctrl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.ironTechnologyGroup.setControl(config.tech, config.cmnt);
          this.dialogFacade.fetchProcessJsonComments(config.tech);
        } else {
          this.ironTechnologyGroup.removeControl(config.tech);
          config.cmnt.reset();
        }
      });
    // set prefilled value on active control
    if (prefilled) {
      this.ironMakingControl.setValue(true);
      config.ctrl.setValue(true);
      config.cmnt.setValue(prefilled.value);
    }
  }

  // Validator to check if at least one checkbox is checked
  private checkboxCheckedValidator() {
    return (formGroup: any): ValidationErrors | null =>
      // only validate if the ironmaking checkbox is checked
      !this.ironMakingControl.value ||
      // verify something has been selected
      Object.keys(formGroup.controls).length > 0
        ? undefined
        : { checkbox_required: true };
  }
}
