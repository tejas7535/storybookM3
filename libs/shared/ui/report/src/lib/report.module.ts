import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';

import { SnackBarModule, SnackBarService } from '@schaeffler/snackbar';

import deJson from './i18n/de.json';
import enJson from './i18n/en.json';
import { ReportComponent } from './report.component';
import { SafeHtmlPipe } from './safe-html.pipe';

@NgModule({
  imports: [
    CommonModule,
    ReactiveComponentModule,
    TranslocoModule,

    // Angular Material
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatTableModule,
    MatDividerModule,
    MatTooltipModule,

    // Todo use native snackbar
    SnackBarModule,
  ],
  declarations: [ReportComponent, SafeHtmlPipe],
  providers: [SnackBarService],
  exports: [ReportComponent],
})
export class ReportModule {
  public constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(deJson, 'de');
  }
}
