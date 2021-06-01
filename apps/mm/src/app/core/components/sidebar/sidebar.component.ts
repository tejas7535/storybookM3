import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';

import { Subscription } from 'rxjs';

import { AvailableLangs } from '@ngneat/transloco';

import { locales, MMLocales } from '../../services/locale/locale.enum';
import { LocaleService } from '../../services/locale/locale.service';
import { MMSeparator } from '../../services/locale/separator.enum';

interface AvailableSeparators {
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

  private readonly subscription = new Subscription();

  private readonly languageSelectControl: FormControl = new FormControl('');
  private readonly separatorSelectControl: FormControl = new FormControl('');

  public availableSeparators: AvailableSeparators[] = [
    { id: ',', label: 'decimalSeparatorComma' },
    { id: '.', label: 'decimalSeparatorPoint' },
  ];

  public availableLangs: AvailableLangs;

  constructor(private readonly localeService: LocaleService) {}

  ngOnInit(): void {
    this.availableLangs = this.localeService.getAvailableLangs();
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

  ngOnDestroy(): void {
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
