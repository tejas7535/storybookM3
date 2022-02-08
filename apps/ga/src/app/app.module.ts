import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReactiveComponentModule } from '@ngrx/component';

import { PERSON_RESPONSIBLE, TERMS_OF_USE } from '@schaeffler/legal-pages';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { responsiblePerson } from './shared/constants';
import { TranslocoService } from '@ngneat/transloco';

export class DynamicTermsOfUse extends String {
  public constructor(protected translocoService: TranslocoService) {
    super('');
  }

  public toString() {
    return this.translocoService.translate('legal.termsOfUseContent');
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    ReactiveComponentModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  providers: [
    {
      provide: PERSON_RESPONSIBLE,
      useValue: responsiblePerson,
    },
    {
      provide: TERMS_OF_USE,
      useClass: DynamicTermsOfUse,
      deps: [TranslocoService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
