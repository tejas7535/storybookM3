import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { FooterModule } from '@schaeffler/footer';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let spectator: Spectator<AppComponent>;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      NoopAnimationsModule,
      FooterModule,
      RouterTestingModule,
      CoreModule,
    ],
    declarations: [AppComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
