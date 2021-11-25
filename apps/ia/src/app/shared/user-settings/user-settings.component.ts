import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { TranslocoService } from '@ngneat/transloco';

import { Language } from './models/language.model';

@Component({
  selector: 'ia-user-settings',
  templateUrl: './user-settings.component.html',
})
export class UserSettingsComponent implements OnInit {
  languageSelectControl: FormControl;
  availableLanguages: Language[];

  constructor(private readonly transloco: TranslocoService) {}

  ngOnInit() {
    this.availableLanguages = this.transloco.getAvailableLangs() as Language[];
    this.languageSelectControl = new FormControl(
      this.transloco.getActiveLang()
    );
  }
}
