import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { SubheaderModule } from '@schaeffler/subheader';

import { SharedModule } from '../shared/shared.module';
import { patchParameters } from './../core/store/actions/parameters/parameters.action';
import { ParametersComponent } from './parameters.component';

describe('ParametersComponent', () => {
  let component: ParametersComponent;
  let spectator: Spectator<ParametersComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: ParametersComponent,
    imports: [
      RouterTestingModule,
      SharedModule,
      ReactiveComponentModule,
      TranslocoTestingModule,

      // UI Modules
      SubheaderModule,
      BreadcrumbsModule,

      // Material Modules
      MatButtonModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          bearing: {
            loading: false,
            result: undefined,
            selectedBearing: 'selected bearing',
          },
          parameter: {
            loads: {
              axial: 0,
              radial: 0,
            },
          },
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;

    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should get selectedBearing from store', (done) => {
      component.selectedBearing$.subscribe((bearing: string) => {
        expect(bearing).toEqual('selected bearing');
        done();
      });

      component.ngOnInit();
    });

    it('should dispatch on valid form change', () => {
      component.radial.patchValue(500);

      expect(store.dispatch).toHaveBeenCalledWith(
        patchParameters({
          parameters: {
            loads: {
              axial: 0,
              radial: 500,
            },
          },
        })
      );
    });

    it('should not dispatch on invalid form change', () => {
      component.radial.patchValue(5_000_000_000_000_000);

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should call the destroy methods', () => {
      component['destroy$'].next = jest.fn();
      component['destroy$'].complete = jest.fn();

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });

  describe('navigateBack', () => {
    it('should navigate to /bearing', () => {
      component['router'].navigate = jest.fn();

      component.navigateBack();

      expect(component['router'].navigate).toHaveBeenCalledWith(['/bearing']);
    });
  });
});
