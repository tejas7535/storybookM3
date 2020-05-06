import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { FilterPanelComponent } from './filter-panel.component';

@NgModule({
  declarations: [FilterPanelComponent],
  imports: [SharedModule, SharedTranslocoModule, MatExpansionModule],
  exports: [FilterPanelComponent],
})
export class FilterPanelModule {}
