import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslocoModule } from '@ngneat/transloco';

import { BannerTextModule } from './banner-text/banner-text.module';
import { StoreModule } from './store/store.module';

import { BannerComponent } from './banner.component';

import { DynamicComponentDirective } from './dynamic-component-directive/dynamic-component.directive';

@NgModule({
  declarations: [BannerComponent, DynamicComponentDirective],
  imports: [CommonModule, StoreModule, BannerTextModule, TranslocoModule],
  exports: [BannerComponent]
})
export class BannerModule {}
