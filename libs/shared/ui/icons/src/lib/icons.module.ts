import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { IconsService } from './icons.service';

export const iconsFactory: Function = (
  iconsService: IconsService
) => (): void => {
  iconsService.registerFontClassAlias();
};

export const initializer = {
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
