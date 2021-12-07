import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { FooterModule } from '@schaeffler/footer';
import { HeaderModule } from '@schaeffler/header';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let store: MockStore;
  let spectator: Spectator<AppComponent>;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      HeaderModule,
      MatButtonModule,
      MatProgressSpinnerModule,
      RouterTestingModule,
      FooterModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          'azure-auth': {
            accountInfo: {
              username: 'Jefferson',
            },
          },
        },
      }),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    declarations: [AppComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Smart Wind Solutions'`, () => {
    expect(component.title).toEqual('Smart Wind Solutions');
  });

  it(`should have the icp number displyed`, () => {
    spectator.component.isLoggedIn$ = of(true);
    spectator.detectChanges();
    const el = spectator.debugElement.query(By.css('#icpnumber'));
    expect(el.nativeElement.textContent).toContain('沪ICP备16014076号');
  });

  it(`should have the publicSecurityBureauNumber displyed`, () => {
    spectator.component.isLoggedIn$ = of(true);
    spectator.detectChanges();
    const el = spectator.debugElement.query(
      By.css('#publicSecurityBureauNumber')
    );
    expect(el.nativeElement.textContent).toContain(
      '沪公网安备31011402009389号'
    );
  });

  describe('ngOnInit', () => {
    it('should set observables and dispatch login', () => {
      store.dispatch = jest.fn();

      component.ngOnInit();

      expect(component.username$).toBeDefined();
      expect(component.isLoggedIn$).toBeDefined();
    });
  });
});
