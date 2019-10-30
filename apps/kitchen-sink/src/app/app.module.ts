import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';

import { ScrollToTopModule } from '@schaeffler/shared/ui-components';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, MatButtonModule, ScrollToTopModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
