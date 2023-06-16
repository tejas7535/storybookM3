import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, NgModule, Provider } from '@angular/core';

import { IconsService } from './icons.service';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function iconsFactory(iconsService: IconsService): () => void {
  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  const func = function (): void {
    iconsService.registerSchaefflerIconSet();
  };

  return func;
}

export const initializer: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: iconsFactory,
  deps: [IconsService],
};

@NgModule({
  imports: [CommonModule],
  providers: [IconsService, initializer],
})
export class IconsModule {}
