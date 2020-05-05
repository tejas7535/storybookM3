import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { HeaderModule } from '@schaeffler/header';
import {
  BannerModule,
  FooterModule,
  ScrollToTopDirective,
  ScrollToTopModule,
  SidebarModule,
} from '@schaeffler/shared/ui-components';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { StoreModule } from '../../core/store';
import { ExtensionDetailComponent } from './extension/extension-detail/extension-detail.component';
import { ExtensionDownloadComponent } from './extension/extension-download/extension-download.component';
import { ExtensionComponent } from './extension/extension.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { OverviewComponent } from './overview/overview.component';

@NgModule({
  declarations: [
    HomeComponent,
    ExtensionDetailComponent,
    ExtensionDownloadComponent,
    ExtensionComponent,
    OverviewComponent,
  ],
  imports: [
    CommonModule,
    BannerModule,
    ClipboardModule,
    HomeRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    FlexLayoutModule,
    FooterModule,
    ScrollToTopModule,
    HeaderModule,
    SidebarModule,
    StoreModule,
    SharedTranslocoModule,
  ],
  providers: [ScrollToTopDirective],
})
export class HomeModule {}
