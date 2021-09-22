import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { OneTrustModule } from '@altack/ngx-onetrust';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { provideMockStore } from '@ngrx/store/testing';

import { COOKIE_GROUPS } from '@schaeffler/application-insights';
import { FooterModule } from '@schaeffler/footer';
import { HeaderModule } from '@schaeffler/header';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { MaterialModule } from './shared/material.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let spectator: Spectator<AppComponent>;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      NoopAnimationsModule,
      HeaderModule,
      FooterModule,
      RouterTestingModule,
      TranslocoTestingModule,
      OneTrustModule.forRoot({
        cookiesGroups: COOKIE_GROUPS,
        domainScript: environment.oneTrustId,
      }),

      // TOOD: remove when sidebar component has its module
      ReactiveFormsModule,
      MaterialModule,
    ],
    providers: [provideMockStore()],
    declarations: [AppComponent, SidebarComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should set embedded to true if in iframe', () => {
    Object.defineProperty(global, 'window', {
      value: {
        self: 'mockValue',
        top: 'otherMockValue',
      },
    });

    component.checkIframe();
    expect(component.embedded).toBe(true);
  });
});
