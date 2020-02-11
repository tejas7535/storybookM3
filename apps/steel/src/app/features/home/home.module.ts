import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/shared/transloco';
import {
  BannerModule,
  FooterModule,
  HeaderModule,
  ScrollToTopDirective,
  ScrollToTopModule,
  SidebarModule
} from '@schaeffler/shared/ui-components';

import { HomeRoutingModule } from './home-routing.module';

import { ExtensionComponent } from './extension/extension.component';
import { ExtensiondetailComponent } from './extension/extensiondetail/extensiondetail.component';
import { HomeComponent } from './home.component';
import { OverviewComponent } from './overview/overview.component';

import { StoreModule } from '../../core/store';

@NgModule({
  declarations: [
    HomeComponent,
    ExtensiondetailComponent,
    ExtensionComponent,
    OverviewComponent
  ],
  imports: [
    CommonModule,
    BannerModule,
    HomeRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    FlexLayoutModule,
    FooterModule,
    ScrollToTopModule,
    HeaderModule,
    SidebarModule,
    StoreModule,
    SharedTranslocoModule
  ],
  providers: [ScrollToTopDirective]
})
export class HomeModule {}
