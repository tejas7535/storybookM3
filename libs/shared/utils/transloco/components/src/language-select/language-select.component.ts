import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { Subscription } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { LangDefinition } from '@ngneat/transloco/lib/types';

@Component({
  selector: 'schaeffler-language-select',
  templateUrl: './language-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectComponent implements OnInit, OnDestroy {
  @Input() public reloadOnLanguageChange = false;

  public availableLanguages =
    this.transloco.getAvailableLangs() as LangDefinition[];
  public languageSelectControl: UntypedFormControl = new UntypedFormControl(
    this.transloco.getActiveLang()
  );
  private readonly subscription = new Subscription();

  public constructor(private readonly transloco: TranslocoService) {}

  public ngOnInit(): void {
    this.subscription.add(
      this.transloco.langChanges$.subscribe((language) => {
        this.languageSelectControl.setValue(language);
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onLanguageSelectionChange(lang: string): void {
    this.transloco.setActiveLang(lang);

    if (this.reloadOnLanguageChange) {
      location.reload();
    }
  }
}
