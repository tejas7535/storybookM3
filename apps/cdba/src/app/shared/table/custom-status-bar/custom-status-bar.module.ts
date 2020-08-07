import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BomViewButtonComponent } from './bom-view-button/bom-view-button.component';
import { DetailViewButtonComponent } from './detail-view-button/detail-view-button.component';

@NgModule({
  declarations: [DetailViewButtonComponent, BomViewButtonComponent],
  imports: [CommonModule, SharedTranslocoModule, MatButtonModule, RouterModule],
  exports: [DetailViewButtonComponent, BomViewButtonComponent],
})
export class CustomStatusBarModule {}
