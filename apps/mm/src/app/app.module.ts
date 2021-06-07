import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HttpLocaleInterceptor } from './shared/interceptors/http-locale.interceptor';

@NgModule({
  imports: [AppRoutingModule, HttpClientModule, CoreModule],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLocaleInterceptor,
      multi: true,
    },
  ],
})
export class AppModule {}
