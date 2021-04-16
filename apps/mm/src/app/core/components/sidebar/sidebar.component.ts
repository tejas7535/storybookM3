import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';

import { Observable, Subscription } from 'rxjs';

import { AvailableLangs } from '@ngneat/transloco';

import { locales, MMLocales } from '../../services/locale/locale.enum';
import { LocaleService } from '../../services/locale/locale.service';
import { MMSeparator } from '../../services/locale/separator.enum';

@Component({
  selector: 'mm-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @ViewChild('sidenav') private readonly sidenav: MatSidenav;

  private subscription = new Subscription();

  availableLangs: AvailableLangs;
  currentSeparator: Observable<MMSeparator>;

  languageSelectControl: FormControl;
  separatorSelectControl: FormControl;

  constructor(
    // @Inject(LOCALE_ID) public locale: string,
    private localeService: LocaleService
  ) {}

  ngOnInit(): void {
    this.availableLangs = this.localeService.getAvailableLangs();
    const activeLocale = this.localeService.getActiveLang() as MMLocales;
    this.languageSelectControl = new FormControl(activeLocale);
    this.separatorSelectControl = new FormControl(
      locales[activeLocale].defaultSeparator
    );
    this.subscription.add(
      this.localeService.getSeparator().subscribe((separator: MMSeparator) => {
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
