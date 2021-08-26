import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { TranslocoService } from '@ngneat/transloco';

import { Language } from '../../models';

@Component({
  selector: 'cdba-user-settings',
  templateUrl: './user-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsComponent {
  languageSelectControl: FormControl = new FormControl(
    this.transloco.getActiveLang()
  );
  availableLangs = this.transloco.getAvailableLangs() as Language[];

  constructor(private readonly transloco: TranslocoService) {}

  setLanguage(lang: string): void {
    this.transloco.setActiveLang(lang);

    location.reload();
  }
}
