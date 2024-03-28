import { Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { Subscription } from 'rxjs';

import { OneTrustService } from '@altack/ngx-onetrust';
import { TranslocoService } from '@ngneat/transloco';

import { LanguageSelectComponent } from '@schaeffler/transloco/components';

import { LocaleService } from '../../services/locale/locale.service';
import { MMSeparator } from '../../services/locale/separator.enum';

interface AvailableOption {
  id: string;
  label: string;
}

@Component({
  selector: 'mm-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit, OnDestroy {
  @Input() public embedded = false;
  languageSelectComponent = LanguageSelectComponent;

  public separatorSelectControl: UntypedFormControl = new UntypedFormControl(
    ''
  );

  public availableSeparators: AvailableOption[] = [
    { id: ',', label: 'decimalSeparatorComma' },
    { id: '.', label: 'decimalSeparatorPoint' },
  ];

  private readonly subscription = new Subscription();

  public constructor(
    private readonly translocoService: TranslocoService,
    private readonly localeService: LocaleService,
    @Optional() private readonly oneTrustService: OneTrustService
  ) {}

  public ngOnInit(): void {
    this.subscription.add(
      this.translocoService.langChanges$.subscribe((language) => {
        this.oneTrustService?.translateBanner(language, true);
      })
    );
    this.subscription.add(
      this.localeService.separator$.subscribe((separator: MMSeparator) => {
        this.separatorSelectControl.setValue(separator);
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public setSeparator(separator: MMSeparator): void {
    this.localeService.setSeparator(separator);
  }
}
