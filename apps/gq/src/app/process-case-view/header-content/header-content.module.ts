import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { InfoIconModule } from '../../shared/info-icon/info-icon.module';

import { SharedModule } from '../../shared';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { HeaderContentComponent } from './header-content.component';

@NgModule({
  declarations: [HeaderContentComponent],
  imports: [
    InfoIconModule,
    SharedModule,
    SharedPipesModule,
    MatMenuModule,
    MatIconModule,
    SharedTranslocoModule,
  ],
  exports: [HeaderContentComponent],
})
export class HeaderContentModule {}
