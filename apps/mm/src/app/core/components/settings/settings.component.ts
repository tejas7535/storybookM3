import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { LanguageConfirmationDialogComponent } from '../../../shared/components/language-confirmation-dialog/language-confirmation-dialog.component';
import { LANGUAGE } from '../../../shared/constants/tracking-names';
import { locales, MMLocales } from '../../services/locale/locale.enum';
import { LocaleService } from '../../services/locale/locale.service';
import { MMSeparator } from '../../services/locale/separator.enum';

interface AvailableOption {
  id: string;
  label: string;
}

@Component({
  selector: 'mm-settings',
  templateUrl: './settings.component.html',
  styles: [
    '::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline-thick { @apply text-link }',
  ],
})
export class SettingsComponent implements OnInit, OnDestroy {
  @Input() public embedded = false;

  private readonly subscription = new Subscription();
  private currentLanguage: string;

  public languageSelectControl: FormControl = new FormControl('');
  public separatorSelectControl: FormControl = new FormControl('');

  public availableSeparators: AvailableOption[] = [
    { id: ',', label: 'decimalSeparatorComma' },
    { id: '.', label: 'decimalSeparatorPoint' },
  ];

  public availableLangs: AvailableOption[];

  public constructor(
    private readonly localeService: LocaleService,
    public readonly dialog: MatDialog,
    private readonly applicationInsightsService: ApplicationInsightsService
  ) {}

  public ngOnInit(): void {
    this.availableLangs =
      this.localeService.getAvailableLangs() as AvailableOption[];
    this.subscription.add(
      this.localeService.language$.subscribe((language: MMLocales) => {
        this.currentLanguage = language;
        this.trackLanguage(language);
        this.languageSelectControl.setValue(language);
        this.separatorSelectControl.setValue(
          locales[language].defaultSeparator
        );
      })
    );
    this.subscription.add(
      this.localeService.separator$.subscribe((separator: MMSeparator) => {
        this.separatorSelectControl.setValue(separator);
      })
    );
  }

  public trackLanguage(language: string): void {
    this.applicationInsightsService.logEvent(LANGUAGE, {
      value: language,
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public setSeparator(separator: MMSeparator): void {
    this.localeService.setSeparator(separator);
  }

  public setLanguage(lang: string): void {
    const dialogRef = this.dialog.open(LanguageConfirmationDialogComponent, {
      maxWidth: 350,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.localeService.setLocale(lang as MMLocales);
      } else {
        this.languageSelectControl.setValue(this.currentLanguage, {
          onlySelf: true,
          emitEvent: false,
        });
      }
    });
  }

  public trackByFn(index: number): number {
    return index;
  }
}
