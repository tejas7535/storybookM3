import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of, Subject } from 'rxjs';

import { Spectator } from '@ngneat/spectator';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../assets/i18n/en.json';
import { LearnMoreComponent } from './learn-more.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string),
}));

describe('LearnMoreComponent', () => {
  let component: LearnMoreComponent;
  let spectator: Spectator<LearnMoreComponent>;
  let store: MockStore;

  const mockActivatedRoute = {
    data: new Subject(),
  };

  const createComponent = createComponentFactory({
    component: LearnMoreComponent,
    imports: [
      CommonModule,
      MatIconModule,
      MatButtonModule,
      SharedTranslocoModule,
      StoreModule,
      SubheaderModule,
      PushModule,
      RouterTestingModule,
      MatIconTestingModule,
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      { provide: ActivatedRoute, useValue: mockActivatedRoute },
      {
        provide: DomSanitizer,
        useValue: {
          bypassSecurityTrustResourceUrl: jest.fn(() => 'sanitizedUrl'),
        },
      },
      provideMockStore({}),
    ],
  });

  const learnMoreContent: any = (val?: any) => ({
    data: {
      imgUrl: 'http://www.test.de/pic_123',
      svgIconUrl: undefined,
      content: ['par1', 'par2'],
      guides: [],
      linkGroups: [],
      requiredRoles: undefined,
      translocoKey: 'unitTest',
      samsLink: 'http://www.test.de/sams_123',
      appLink: 'http://www.test.de/app_123',
      ...val,
    },
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('register svgIcon', () => {
    const url = 'http://some.url';
    component['matIconRegistry'].addSvgIcon = jest.fn();
    mockActivatedRoute.data.next(learnMoreContent({ svgIconUrl: url }));

    expect(component['matIconRegistry'].addSvgIcon).toHaveBeenCalled();
  });

  it('required roles is empty', () => {
    store.pipe = jest.fn().mockReturnValue(of(true));
    mockActivatedRoute.data.next(learnMoreContent({ requiredRoles: [] }));

    component.hasRequiredRoles().forEach((val) => expect(val).toBeTruthy());
  });

  it('required roles is undefined', () => {
    store.pipe = jest.fn().mockReturnValue(of(true));
    mockActivatedRoute.data.next(
      learnMoreContent({ requiredRoles: undefined })
    );

    component.hasRequiredRoles().forEach((val) => expect(val).toBeTruthy());
  });

  it('required roles should be included', () => {
    store.pipe = jest.fn().mockReturnValue(of(true));
    mockActivatedRoute.data.next(
      learnMoreContent({ requiredRoles: ['role to be found'] })
    );

    component.hasRequiredRoles().forEach((val) => expect(val).toBeTruthy());
  });

  it('required roles should NOT be included', () => {
    store.pipe = jest.fn().mockReturnValue(of(false));
    mockActivatedRoute.data.next(
      learnMoreContent({ requiredRoles: ['not your role'] })
    );

    component.hasRequiredRoles().forEach((val) => expect(val).toBeFalsy());
    expect(store.pipe).toHaveBeenCalled();
  });

  it('showMore should be false on default', () => {
    expect(component['showMore']).toBeFalsy();
  });

  it('showMore should be True after toggle', () => {
    component.toggleShowMore();
    expect(component['showMore']).toBeTruthy();
  });

  it('local path should be an image', () => {
    expect(component.isImage('../path/to/assets/folder.png')).toBeTruthy();
  });

  it('web anchor should be an image', () => {
    expect(component.isImage('https://www.pictum.com')).toBeTruthy();
  });

  it('text should NOT be an image', () => {
    expect(component.isImage('some random text')).toBeFalsy();
  });

  test.each([
    [[''], 15, ['']],
    [['abc def ghi'], 0, ['abc']],
    [['abc def ghi'], 4, ['abc def']],
    [['abc def ghi'], 6, ['abc def']],
    [['abc def ghi'], 16, ['abc def ghi']],
    [['abc ', 'def', 'ghi'], 0, ['abc']],
    [['abc ', 'def', 'ghi'], 2, ['abc']],
    [['abc ', 'def', 'ghi'], 5, ['abc ', 'def']],
    [['abc ', 'def', 'ghi'], 7, ['abc ', 'def']],
    [['abc ', 'def', 'ghi'], 16, ['abc ', 'def', 'ghi']],
    [['abc', '../path/to/img.png', 'ghi'], 96, ['abc']],
  ])(
    '%s truncate to %i should return %s',
    (content: string[], size: number, expected: string[]) => {
      expect(component.getTruncatedOverview(content, size)).toMatchObject(
        expected
      );
    }
  );
});
