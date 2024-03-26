import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslocoService } from '@ngneat/transloco';
import { LetDirective, PushPipe } from '@ngrx/component';

import { AppShellModule } from '@schaeffler/app-shell';
import {
  DATA_SOURCE,
  PERSON_RESPONSIBLE,
  PURPOSE,
} from '@schaeffler/legal-pages';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CopyInputComponent } from './components/copy-input/copy-input.component';
import { GeometricalInformationComponent } from './components/geometrical-information/geometrical-information.component';
import { HardnessConverterComponent } from './components/hardness-converter/hardness-converter.component';
import { LearnMoreComponent } from './components/learn-more/learn-more.component';
import { SettingsPanelComponent } from './components/settings-panel/settings-panel.component';
import { CoreModule } from './core/core.module';

export function DynamicPurpose(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.purpose');
}

export function DynamicDataSource(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.dataSource');
}

@NgModule({
  declarations: [AppComponent, HardnessConverterComponent],
  imports: [
    // angular modules
    CommonModule,
    BrowserAnimationsModule,
    PushPipe,
    LetDirective,
    CoreModule,
    AppRoutingModule,

    GeometricalInformationComponent,
    CopyInputComponent,

    SettingsPanelComponent,

    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatButtonModule,
    ReactiveFormsModule,
    PushPipe,
    LearnMoreComponent,

    // UI Modules
    AppShellModule,
  ],
  providers: [
    {
      provide: PERSON_RESPONSIBLE,
      useValue: 'Dr. Johannes Möller',
    },
    {
      provide: PURPOSE,
      useFactory: DynamicPurpose,
      deps: [TranslocoService],
    },
    {
      provide: DATA_SOURCE,
      useFactory: DynamicDataSource,
      deps: [TranslocoService],
    },
    DecimalPipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
