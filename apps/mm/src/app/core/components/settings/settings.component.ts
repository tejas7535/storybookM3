import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';

import { OneTrustService } from '@altack/ngx-onetrust';
import { TranslocoService } from '@ngneat/transloco';

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

  private readonly subscription = new Subscription();
  public separatorSelectControl: FormControl = new FormControl('');

  public availableSeparators: AvailableOption[] = [
    { id: ',', label: 'decimalSeparatorComma' },
    { id: '.', label: 'decimalSeparatorPoint' },
  ];

  public constructor(
    private readonly translocoService: TranslocoService,
    private readonly oneTrustService: OneTrustService,
    private readonly localeService: LocaleService
  ) {}

  public ngOnInit(): void {
    this.subscription.add(
      this.translocoService.langChanges$.subscribe((language) => {
        this.oneTrustService.translateBanner(language, true);
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

  public trackByFn(index: number): number {
    return index;
  }
}
