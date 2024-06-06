import { MatIconTestingModule } from '@angular/material/icon/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { of, Subject } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SafeHtmlPipe } from '@mac/shared/pipes/safe-html/safe-html.pipe';

import * as en from '../../../assets/i18n/en.json';
import { LearnMoreComponent } from './learn-more.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string),
}));

describe('LearnMoreComponent', () => {
  let component: LearnMoreComponent;
  let spectator: Spectator<LearnMoreComponent>;
  let store: MockStore;

  const mockActivatedRouteData = new Subject();

  const createComponent = createComponentFactory({
    component: LearnMoreComponent,
    imports: [
      MockPipe(PushPipe),
      MockPipe(SafeHtmlPipe),
      MatIconTestingModule,
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      {
        provide: DomSanitizer,
        useValue: {
          bypassSecurityTrustResourceUrl: jest.fn(() => 'sanitizedUrl'),
        },
      },
      provideMockStore({}),
      provideRouter([]),
    ],
    detectChanges: false,
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

    component['activatedroute'].data = mockActivatedRouteData;

    store = spectator.inject(MockStore);

    spectator.detectChanges();
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
    mockActivatedRouteData.next(learnMoreContent({ svgIconUrl: url }));

    expect(component['matIconRegistry'].addSvgIcon).toHaveBeenCalled();
  });

  describe('ngAfterViewInit', () => {
    it('should scroll to fragment', () => {
      component['activatedroute'].snapshot.fragment = 'test';
      const mockScrollIntoView = jest.fn();
      const spy = jest.spyOn(document, 'querySelector');
      spy.mockImplementation(
        () =>
          ({
            scrollIntoView: mockScrollIntoView,
          }) as unknown as Element
      );

      component.ngAfterViewInit();

      expect(spy).toHaveBeenCalledWith('#test');
      expect(mockScrollIntoView).toHaveBeenCalled();

      spy.mockRestore();
    });

    it('should do nothing if fragment is not defined', () => {
      const mockScrollIntoView = jest.fn();
      const spy = jest.spyOn(document, 'querySelector');
      spy.mockImplementation(
        () =>
          ({
            scrollIntoView: mockScrollIntoView,
          }) as unknown as Element
      );

      component.ngAfterViewInit();

      expect(spy).not.toHaveBeenCalled();
      expect(mockScrollIntoView).not.toHaveBeenCalled();

      spy.mockRestore();
    });
  });

  it('required roles is empty', () => {
    store.pipe = jest.fn().mockReturnValue(of(true));
    mockActivatedRouteData.next(learnMoreContent({ requiredRoles: [] }));

    component.hasRequiredRoles().forEach((val) => expect(val).toBeTruthy());
  });

  it('required roles is undefined', () => {
    store.pipe = jest.fn().mockReturnValue(of(true));
    mockActivatedRouteData.next(learnMoreContent({ requiredRoles: undefined }));

    component.hasRequiredRoles().forEach((val) => expect(val).toBeTruthy());
  });

  it('required roles should be included', () => {
    store.pipe = jest.fn().mockReturnValue(of(true));
    mockActivatedRouteData.next(
      learnMoreContent({ requiredRoles: ['role to be found'] })
    );

    component.hasRequiredRoles().forEach((val) => expect(val).toBeTruthy());
  });

  it('required roles should NOT be included', () => {
    store.pipe = jest.fn().mockReturnValue(of(false));
    mockActivatedRouteData.next(
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
