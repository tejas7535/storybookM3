import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ENV_CONFIG, EnvironmentConfig } from './environment-config.interface';

@NgModule({
  imports: [CommonModule, MatSnackBarModule],
})
export class HttpModule {
  public static forRoot(
    config: EnvironmentConfig
  ): ModuleWithProviders<HttpModule> {
    return {
      ngModule: HttpModule,
      providers: [
        {
          provide: ENV_CONFIG,
          useValue: config,
        },
      ],
    };
  }
}
