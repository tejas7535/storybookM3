import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { provideMockStore } from '@ngrx/store/testing';

import { FooterTailwindModule } from '@schaeffler/footer-tailwind';
import { HeaderModule } from '@schaeffler/header';

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
      FooterTailwindModule,
      RouterTestingModule,
      TranslocoTestingModule,

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
