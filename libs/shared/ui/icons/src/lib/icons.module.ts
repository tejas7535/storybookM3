import { CommonModule } from '@angular/common';
import {
  EnvironmentProviders,
  inject,
  NgModule,
  provideAppInitializer,
} from '@angular/core';

import { IconsService } from './icons.service';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function iconsFactory(iconsService: IconsService): () => void {
  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  const func = function (): void {
    iconsService.registerSchaefflerIconSet();
  };

  return func;
}

export const initializer: EnvironmentProviders = provideAppInitializer(() => {
  const initializerFn = iconsFactory(inject(IconsService));

  return initializerFn();
});

@NgModule({
  imports: [CommonModule],
  providers: [IconsService, initializer],
})
export class IconsModule {}
