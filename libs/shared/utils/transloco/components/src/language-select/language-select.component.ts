import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { TranslocoService } from '@ngneat/transloco';
import { LangDefinition } from '@ngneat/transloco/lib/types';

@Component({
  selector: 'schaeffler-language-select',
  templateUrl: './language-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectComponent {
  @Input() public reloadOnLanguageChange = false;

  public availableLanguages =
    this.transloco.getAvailableLangs() as LangDefinition[];
  public languageSelectControl: FormControl = new FormControl(
    this.transloco.getActiveLang()
  );

  public constructor(private readonly transloco: TranslocoService) {}

  public onLanguageSelectionChange(lang: string): void {
    this.transloco.setActiveLang(lang);

    if (this.reloadOnLanguageChange) {
      location.reload();
    }
  }
}
