import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { StoreModule } from './core/store/store.module';

@NgModule({
  imports: [BrowserAnimationsModule, AppRoutingModule, CoreModule, StoreModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
