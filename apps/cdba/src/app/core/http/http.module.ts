import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { ENV_CONFIG, EnvironmentConfig } from './environment-config.interface';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';

@NgModule({
  imports: [CommonModule],
})
export class HttpModule {
  static forRoot(config: EnvironmentConfig): ModuleWithProviders<HttpModule> {
    return {
      ngModule: HttpModule,
      providers: [
        {
          provide: ENV_CONFIG,
          useValue: config,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptor,
          multi: true,
        },
      ],
    };
  }
}
