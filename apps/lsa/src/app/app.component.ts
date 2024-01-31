import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';

import { TranslocoService } from '@ngneat/transloco';

import { isLanguageAvailable } from './core/services/language-helpers';
import { LsaAppService } from './core/services/lsa-app.service';
import { FALLBACK_LANGUAGE } from './shared/constants/language';
import { Page } from './shared/models/page.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'lubricator-selection-assistant',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  @Input() language: string | undefined;

  public readonly pages: Page[] = this.lsaAppService.getPages();

  constructor(
    private readonly lsaAppService: LsaAppService,
    private readonly translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    const currentLanguage = isLanguageAvailable(this.language)
      ? this.language
      : FALLBACK_LANGUAGE.id;

    this.translocoService.setActiveLang(currentLanguage);
  }

  selectionChanged(event: StepperSelectionEvent): void {
    this.lsaAppService.setSelectedPage(event.selectedIndex);
    this.lsaAppService.setCompletedStep(event.previouslySelectedIndex);
  }
}
