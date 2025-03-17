import {
  ClassProvider,
  effect,
  ExistingProvider,
  FactoryProvider,
  InjectionToken,
  Injector,
  Provider,
  ProviderToken,
  SchemaMetadata,
  StaticProvider,
  Type,
  ValueProvider,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { GridApi } from 'ag-grid-enterprise';
import { MockProvider, MockService } from 'ng-mocks';

import { GlobalSelectionHelperService } from '../../feature/global-selection/global-selection.service';
import { IMRService } from '../../feature/internal-material-replacement/imr.service';
import { GlobalSelectionStateService } from '../components/global-selection-criteria/global-selection-state.service';
import { AgGridLocalizationService } from '../services/ag-grid-localization.service';
import { SelectableOptionsService } from '../services/selectable-options.service';
import { SnackbarService } from '../utils/service/snackbar.service';
import { ValidationHelper } from '../utils/validation/validation-helper';

// Angular's effect function depends on a lot of deeper Angular stuff. We want to enable unit testing at the component level, so we need to be able to inject a standalone effect function
export const EFFECT_FACTORY_TOKEN = new InjectionToken('effect');
export type EffectFactory = typeof effect;

export function provideEffect(): Provider {
  return { provide: EFFECT_FACTORY_TOKEN, useValue: effect };
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Stub {
  private static readonly defaultMockedProviders: (
    | ValueProvider
    | FactoryProvider
    | ClassProvider
    | ExistingProvider
  )[] = [
    MockProvider(
      TranslocoService,
      {
        langChanges$: of('en'),
        config: {
          defaultLang: 'en',
          reRenderOnLangChange: false,
          prodMode: false,
          failedRetries: 1,
        },
        setTranslation: () => {},
      },
      'useValue'
    ),
    MockProvider(TranslocoLocaleService, {
      getLocale: jest.fn().mockReturnValue('en-US'),
    }),
    MockProvider(
      MatDialogRef,
      { afterClosed: () => of({ reloadData: true }), close: () => {} },
      'useValue'
    ),
    MockProvider(IMRService, {
      saveMultiIMRSubstitution: jest.fn().mockReturnValue(of({} as any)),
    }),
    MockProvider(SnackbarService),
    MockProvider(SelectableOptionsService),
    MockProvider(
      GlobalSelectionHelperService,
      {
        getResultCount: jest.fn().mockReturnValue(of(0)),
        getCustomersData: jest.fn().mockReturnValue(of([])),
      },
      'useValue'
    ),
    MockProvider(
      GlobalSelectionStateService,
      {
        form: jest.fn().mockReturnValue(new FormGroup({})),
        getState: jest.fn().mockReturnValue({}),
        getGlobalSelectionStatus: jest.fn().mockReturnValue(''),
      },
      'useValue'
    ),
    MockProvider(AgGridLocalizationService, { lang: jest.fn() }, 'useValue'),
  ];

  private static fixture: ComponentFixture<any> | null = null;

  public static get<T>({
    component,
    providers,
  }: {
    component: ProviderToken<T>;
    providers?: (Provider | StaticProvider)[];
  }): T {
    this.fixture = null;
    this.initValidationHelper();

    return Injector.create({
      providers: [
        this.defaultMockedProviders,
        ...(providers ?? []),
        { provide: component },
      ] as (Provider | StaticProvider)[],
    }).get(component);
  }

  public static getForEffect<T>({
    component,
    providers,
    declarations,
    imports,
    schemas,
  }: {
    component: Type<T>;
    providers?: (Provider | StaticProvider)[];
    declarations?: (Provider | StaticProvider)[];
    imports?: any[];
    schemas?: (SchemaMetadata | any[])[];
  }): T {
    this.fixture = null;

    TestBed.configureTestingModule({
      declarations: [...(declarations ?? [])],
      imports: [component, ...(imports ?? [])],
      // TODO: check, if component is part of defaultMockedProviders, if it is working
      providers: [this.defaultMockedProviders, ...(providers ?? [])],
      schemas,
    }).compileComponents();

    this.initValidationHelper();
    this.fixture = TestBed.createComponent<T>(component);

    return this.fixture.debugElement.componentInstance;
  }

  public static setInputs(inputs: { property: string; value: any }[]): void {
    if (!this.fixture) {
      throw new Error(
        '[Stub] No fixture available, did you used stub.get() instead of Stub.getWithEffect()?'
      );
    }

    Object.values(inputs).forEach(({ property, value }) =>
      this.setInput(property, value)
    );
  }

  public static setInput(property: string, value: any): void {
    if (!this.fixture) {
      throw new Error(
        '[Stub] No fixture available, did you used stub.get() instead of Stub.getWithEffect()?'
      );
    }

    this.fixture.componentRef.setInput(property, value);
  }

  public static detectChanges(): void {
    if (!this.fixture) {
      throw new Error(
        '[Stub] No fixture available, did you used stub.get() instead of Stub.getWithEffect()?'
      );
    }

    this.fixture.detectChanges();
  }

  public static getFixture<T = any>(): ComponentFixture<T> {
    if (!this.fixture) {
      throw new Error(
        '[Stub] No fixture available, did you used stub.get() instead of Stub.getWithEffect()?'
      );
    }

    return this.fixture;
  }

  public static getGridApi(): GridApi {
    return {
      setGridOption: jest.fn(),
      showNoRowsOverlay: jest.fn(),
      hideOverlay: jest.fn(),
      autoSizeAllColumns: jest.fn(),
      expandAll: jest.fn(),
      collapseAll: jest.fn(),
      refreshServerSide: jest.fn(),
    } as any;
  }

  private static initValidationHelper(): void {
    ValidationHelper.localeService = MockService(TranslocoLocaleService, {
      getLocale: jest.fn().mockReturnValue('en-US'),
      localizeDate: jest.fn().mockReturnValue(''),
    });
  }
}
