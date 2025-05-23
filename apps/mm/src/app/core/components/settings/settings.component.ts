import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { Subject, takeUntil } from 'rxjs';

import { OneTrustService } from '@altack/ngx-onetrust';
import { TranslocoService } from '@jsverse/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';
import {
  LanguageSelectComponent,
  LanguageSelectModule,
} from '@schaeffler/transloco/components';

import { LocaleService } from '../../services/locale/locale.service';
import { MMSeparator } from '../../services/locale/separator.enum';

interface AvailableOption {
  id: string;
  label: string;
}

@Component({
  selector: 'mm-settings',
  templateUrl: './settings.component.html',
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    CommonModule,
    LanguageSelectModule,
    SharedTranslocoModule,
  ],
})
export class SettingsComponent implements OnInit, OnDestroy {
  private readonly translocoService = inject(TranslocoService);
  private readonly localeService = inject(LocaleService);
  private readonly oneTrustService = inject(OneTrustService, {
    optional: true,
  });

  private readonly destroy$ = new Subject<void>();

  languageSelectComponent = LanguageSelectComponent;

  public separatorSelectControl: UntypedFormControl = new UntypedFormControl(
    ''
  );

  public availableSeparators: AvailableOption[] = [
    { id: ',', label: 'decimalSeparatorComma' },
    { id: '.', label: 'decimalSeparatorPoint' },
  ];

  public ngOnInit(): void {
    this.translocoService.langChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe((language) => {
        this.oneTrustService?.translateBanner(language, true);
      });
    this.localeService.separator$
      .pipe(takeUntil(this.destroy$))
      .subscribe((separator: MMSeparator) => {
        this.separatorSelectControl.setValue(separator);
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public setSeparator(separator: MMSeparator): void {
    this.localeService.setSeparator(separator);
  }
}
