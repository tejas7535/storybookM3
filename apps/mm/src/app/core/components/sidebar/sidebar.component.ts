import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';

import { Subscription } from 'rxjs';

import { locales, MMLocales } from '../../services/locale/locale.enum';
import { LocaleService } from '../../services/locale/locale.service';
import { MMSeparator } from '../../services/locale/separator.enum';

interface AvailableOption {
  id: string;
  label: string;
}

@Component({
  selector: 'mm-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') private readonly sidenav: MatSidenav;
  @Input() public embedded = false;

  private readonly subscription = new Subscription();

  public languageSelectControl: FormControl = new FormControl('');
  public separatorSelectControl: FormControl = new FormControl('');

  public availableSeparators: AvailableOption[] = [
    { id: ',', label: 'decimalSeparatorComma' },
    { id: '.', label: 'decimalSeparatorPoint' },
  ];

  public availableLangs: AvailableOption[];

  public constructor(private readonly localeService: LocaleService) {}

  public ngOnInit(): void {
    this.availableLangs =
      this.localeService.getAvailableLangs() as AvailableOption[];
    this.subscription.add(
      this.localeService.language$.subscribe((language: MMLocales) => {
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

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public setSeparator(separator: MMSeparator): void {
    this.localeService.setSeparator(separator);
  }

  public setLanguage(lang: string): void {
    this.localeService.setLocale(lang as MMLocales);
  }

  public trackByFn(index: number): number {
    return index;
  }

  public toggle(): void {
    this.sidenav.toggle();
  }
}
