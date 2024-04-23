import { Component, Input, OnInit } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';

import { isLanguageAvailable } from './core/services/language-helpers';
import { RestService } from './core/services/rest.service';
import { FALLBACK_LANGUAGE } from './shared/constants/language';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'lubricator-selection-assistant',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  @Input() language: string | undefined;

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly restService: RestService
  ) {}

  ngOnInit(): void {
    const currentLanguage = isLanguageAvailable(this.language)
      ? this.language
      : FALLBACK_LANGUAGE.id;

    this.translocoService.setActiveLang(currentLanguage);

    this.fetchGreases();
  }

  fetchGreases(): void {
    this.restService.getGreases();
  }
}
