import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RefTypeRoutingModule } from './ref-type-routing.module';

import { RefTypeComponent } from './ref-type.component';

@NgModule({
  declarations: [RefTypeComponent],
  imports: [CommonModule, RefTypeRoutingModule]
})
export class RefTypeModule {}
