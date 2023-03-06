import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PushModule } from '@ngrx/component';

import { AppComponent } from './app.component';
import { CalculationParametersComponent } from './features/calculation-parameters/calculation-parameters';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    PushModule,
    BrowserAnimationsModule,
    CalculationParametersComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
