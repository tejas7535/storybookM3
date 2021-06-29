import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';

import { Subscription } from 'rxjs';

import { LanguageConfirmationDialogComponent } from '../../../shared/components/language-confirmation-dialog/language-confirmation-dialog.component';
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
    public readonly dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.availableLangs =
      this.localeService.getAvailableLangs() as AvailableOption[];
    this.subscription.add(
      this.localeService.language$.subscribe((language: MMLocales) => {
        this.currentLanguage = language;
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
    const dialogRef = this.dialog.open(LanguageConfirmationDialogComponent, {
      maxWidth: 350,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.localeService.setLocale(lang as MMLocales);
        this.sidenav.close();
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

  public toggle(): void {
    this.sidenav.toggle();
  }
}
