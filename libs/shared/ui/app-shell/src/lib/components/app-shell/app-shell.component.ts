/* eslint-disable @typescript-eslint/member-ordering */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSidenavContent } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';

import { filter } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

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
export class AppShellComponent implements OnInit {
  @Input() public appTitle: string;
  @Input() public appTitleLink?: string;
  @Input() public hasSidebarLeft = false;
  @Input() public userName?: string;
  @Input() public userImageUrl?: string;
  @Input() public hasFooter? = false;
  @Input() public footerLinks?: AppShellFooterLink[] = [];
  @Input() public footerFixed? = true;
  @Input() public appVersion?: string;
  @Input() public scrollToTop? = false;
  @Input() public set showSideNav(value: boolean) {
    this._sideNavOpen = value;
  }

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onContentScroll = new EventEmitter();
  @Output() public sidenavOpenChange = new EventEmitter<boolean>();

  @ViewChild('sidenavContent')
  private readonly sidenavContent: MatSidenavContent;

  private _sideNavOpen = false;

  public constructor(
    private readonly translocoService: TranslocoService,
    private readonly router: Router
  ) {
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(deJson, 'de');
    this.translocoService.setTranslation(esJson, 'es');
    this.translocoService.setTranslation(frJson, 'fr');
    this.translocoService.setTranslation(ruJson, 'ru');
    this.translocoService.setTranslation(zhJson, 'zh');
  }

  public get sidenavOpen(): boolean {
    return this._sideNavOpen;
  }

  public set sidenavOpen(value: boolean) {
    this._sideNavOpen = value;
    this.sidenavOpenChange.emit(value);
  }

  // close the sidenav when pressing "esc"
  @HostListener('document:keyup.esc')
  public onEscKeyUp() {
    this.sidenavOpen = false;
  }

  public handleClick(link: AppShellFooterLink, $event: MouseEvent) {
    if (link.onClick) {
      link.onClick($event);
    }
  }

  public handleContentScroll($event: Event) {
    this.onContentScroll.emit($event);
  }

  public ngOnInit(): void {
    if (this.scrollToTop) {
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.sidenavContent.scrollTo({ top: 0 });
        });
    }
  }
}
