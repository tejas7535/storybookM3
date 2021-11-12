import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
} from '@angular/core';

import { TranslocoService } from '@ngneat/transloco';

import { sidenavToggleAnimation } from '../../animations/sidenav.animations';
import deJson from '../../i18n/de.json';
import enJson from '../../i18n/en.json';
import esJson from '../../i18n/es.json';
import frJson from '../../i18n/fr.json';
import ruJson from '../../i18n/ru.json';
import zhJson from '../../i18n/zh.json';
import { AppShellFooterLink } from '../../models';

@Component({
  selector: 'schaeffler-app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  animations: [sidenavToggleAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  @Input() public appTitle: string;
  @Input() public appTitleLink?: string;
  @Input() public hasSidebarLeft = false;
  @Input() public userName?: string;
  @Input() public userImageUrl?: string;
  @Input() public hasFooter? = false;
  @Input() public footerLinks?: AppShellFooterLink[] = [];
  @Input() public footerFixed? = true;
  @Input() public appVersion?: string;

  public sidenavOpen = false;

  public constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(deJson, 'de');
    this.translocoService.setTranslation(esJson, 'es');
    this.translocoService.setTranslation(frJson, 'fr');
    this.translocoService.setTranslation(ruJson, 'ru');
    this.translocoService.setTranslation(zhJson, 'zh');
  }

  // close the sidenav when pressing "esc"
  @HostListener('document:keyup.esc')
  public onEscKeyUp() {
    this.sidenavOpen = false;
  }
}
