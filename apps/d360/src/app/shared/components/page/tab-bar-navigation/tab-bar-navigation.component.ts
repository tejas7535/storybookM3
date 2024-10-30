import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { Data, NavigationEnd, Router, RouterModule } from '@angular/router';

import { Observable, of } from 'rxjs';

import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { appRoutes } from '../../../../app.routes';
import { AuthService } from '../../../utils/auth/auth.service';

type TabItem = 'start-page' | 'functions' | 'tasks';

@Component({
  selector: 'app-tab-bar-navigation',
  standalone: true,
  imports: [
    RouterModule,
    SharedTranslocoModule,
    MatTabsModule,
    MatMenuModule,
    MatIconModule,
    AsyncPipe,
    PushPipe,
  ],
  templateUrl: './tab-bar-navigation.component.html',
  styleUrl: './tab-bar-navigation.component.scss',
})
export class TabBarNavigationComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  routeConfig = appRoutes;

  activeTab: TabItem = 'start-page';

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeTab = this.getTabItemForRoute(event.url);
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]).then(() => {
      this.activeTab = this.getTabItemForRoute(path);
    });
  }

  getTabItemForRoute = (route: string): TabItem => {
    if (route === '/' || route === '') {
      return 'start-page';
    } else if (route === '/tasks' || route === 'tasks') {
      return 'tasks';
    }

    return 'functions';
  };

  canNavigateTo$ = (data: Data): Observable<boolean> => {
    if (!data || !data.allowedRoles) {
      return of(true);
    }

    const allowedRoles = data.allowedRoles;

    return this.authService.hasUserAccess(allowedRoles);
  };
}
