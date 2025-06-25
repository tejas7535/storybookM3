import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';

import { take, tap } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { StyledSectionComponent } from '../../../shared/components/styled-section/styled-section.component';
import { ValidateForm } from '../../../shared/decorators';
import { SystemMessageSettings } from '../../../shared/models/user-settings.model';
import { SystemMessageService } from '../../../shared/services/system-message.service';

export enum AlertType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
}

@Component({
  selector: 'd360-banner-settings',
  imports: [
    MatIcon,
    RouterLink,
    StyledSectionComponent,
    MatDividerModule,
    TranslocoModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatButton,
    LoadingSpinnerModule,
  ],
  templateUrl: './banner-settings.component.html',
  standalone: true,
})
export class BannerSettingsComponent implements OnInit {
  private readonly systemMessageService = inject(SystemMessageService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = new FormGroup({
    message: new FormControl<string | null>(null, {
      validators: Validators.required,
    }),
    headline: new FormControl<string | null>(null),
    active: new FormControl<boolean>(true),
    closable: new FormControl<boolean>(true),
    type: new FormControl<string | null>(AlertType.INFO, {
      validators: Validators.required,
    }),
  });

  protected formContent = [
    { type: 'input', name: 'headline', maxLength: 200 },
    { type: 'textarea', name: 'message', maxLength: 500 },
    { type: 'select', name: 'type', options: Object.values(AlertType) },
    { type: 'toggle', name: 'active' },
    { type: 'toggle', name: 'closable' },
  ];

  protected readonly loading = this.systemMessageService.loading;

  public ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.systemMessageService
      .get$()
      .pipe(
        take(1),
        tap((settings) => {
          this.form.patchValue({
            message: settings?.message || null,
            headline: settings?.headline || null,
            active: settings?.active || null,
            closable: settings?.closable || null,
            type: settings?.type || AlertType.INFO,
          });

          this.form.markAsPristine();
          this.form.markAsUntouched();
          this.form.updateValueAndValidity();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  @ValidateForm('form')
  protected onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value as SystemMessageSettings;

      this.systemMessageService.put$(formValue).subscribe();
    }
  }
}
